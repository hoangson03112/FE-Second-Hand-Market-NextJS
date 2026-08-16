import type { ShippingServiceOption } from "@/types/address";
import type {
  ShipmentQuote,
  ShipmentQuoteRequest,
  ShipmentQuoteResponse,
  ShipmentQuotes,
} from "@/types/shipping";
import { logger } from "@/infrastructure/monitoring/logger";

export type { ShipmentQuoteRequest, ShipmentQuotes };

/**
 * Shipping quotes for checkout.
 *
 * All GHN traffic happens server-side in `/api/shipping/quote`: the browser
 * sends one request carrying every seller's shipment and gets every fee back,
 * instead of paying three sequential GHN round trips per seller. That also
 * keeps fee lookups off the shared GHN proxy rate limiter that province /
 * district / ward lookups run through.
 */

/** Long enough for a cold GHN call plus one server-side retry. */
const QUOTE_TIMEOUT_MS = 20_000;

const QUOTE_URL =
  typeof window === "undefined"
    ? `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/shipping/quote`
    : "/api/shipping/quote";

/** GHN returns leadtime as a UNIX timestamp (seconds) for the delivery date. */
function toShippingOption(quote: ShipmentQuote): ShippingServiceOption {
  const expectedDeliveryDate = new Date(quote.leadtime * 1000);
  const diffMs = expectedDeliveryDate.getTime() - Date.now();
  const estimatedDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  return {
    service_id: quote.service_id,
    service_type_id: quote.service_type_id,
    short_name: quote.short_name,
    service_name: quote.service_name,
    fee: quote.fee.total,
    shippingFee: quote.fee.service_fee,
    insuranceFee: quote.fee.insurance_fee,
    codFee: quote.fee.cod_fee,
    totalShippingFee: quote.fee.total,
    expectedDeliveryTime: expectedDeliveryDate.toISOString(),
    estimatedDays,
    estimatedDate: expectedDeliveryDate.toLocaleDateString("vi-VN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
  };
}

export const ShippingService = {
  /**
   * Quote every shipment in a checkout with a single request.
   *
   * Never rejects on a per-shipment failure — a seller with an unconfigured
   * pickup address lands in `errors` while the rest still get priced. It only
   * throws when the request itself fails, which is the one case where nothing
   * can be shown.
   */
  quoteShipments: async (params: {
    to_district_id: number;
    to_ward_code: string;
    shipments: ShipmentQuoteRequest[];
    signal?: AbortSignal;
  }): Promise<ShipmentQuotes> => {
    const { to_district_id, to_ward_code, shipments, signal } = params;

    if (shipments.length === 0) return { options: {}, errors: {} };

    // Caller-supplied abort (address changed) and the timeout both need to cancel
    // the same fetch.
    const timeout = AbortSignal.timeout(QUOTE_TIMEOUT_MS);
    const abort = signal ? AbortSignal.any([signal, timeout]) : timeout;

    let response: Response;
    try {
      response = await fetch(QUOTE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to_district_id, to_ward_code, shipments }),
        signal: abort,
      });
    } catch (error) {
      if (signal?.aborted) throw error;
      logger.error("Shipping quote request failed", error as Error, {
        shipmentCount: shipments.length,
      });
      throw new Error("Không thể tính phí vận chuyển. Vui lòng thử lại.");
    }

    const payload = (await response
      .json()
      .catch(() => null)) as ShipmentQuoteResponse | null;

    if (!response.ok || !payload?.success) {
      const message = payload?.message || "Không thể tính phí vận chuyển.";
      logger.error("Shipping quote returned an error", undefined, {
        status: response.status,
        message,
      });
      throw new Error(message);
    }

    const options: Record<string, ShippingServiceOption> = {};
    const errors: Record<string, string> = {};

    for (const result of payload.results ?? []) {
      if (result.ok && result.data) {
        options[result.id] = toShippingOption(result.data);
      } else {
        errors[result.id] = result.error || "Không tính được phí vận chuyển.";
      }
    }

    logger.info("Shipping quotes resolved", {
      quoted: Object.keys(options).length,
      failed: Object.keys(errors).length,
    });

    return { options, errors };
  },

  /**
   * Single-shipment convenience wrapper. Throws on failure so callers that only
   * care about one seller keep a simple success/throw contract.
   */
  calculateShippingInfo: async (params: {
    from_district_id: number;
    from_ward_code: string;
    to_district_id: number;
    to_ward_code: string;
    weight?: number;
    service_type_id?: number;
  }): Promise<ShippingServiceOption> => {
    const { options, errors } = await ShippingService.quoteShipments({
      to_district_id: params.to_district_id,
      to_ward_code: params.to_ward_code,
      shipments: [
        {
          id: "single",
          from_district_id: params.from_district_id,
          from_ward_code: params.from_ward_code,
          weight: params.weight,
          service_type_id: params.service_type_id,
        },
      ],
    });

    const option = options.single;
    if (!option) {
      throw new Error(errors.single || "Không thể tính phí vận chuyển.");
    }
    return option;
  },
};
