import type { ShippingServiceOption } from "./address";

/**
 * Contract shared by the `/api/shipping/quote` Route Handler, the server-side
 * GHN client, and the browser service that calls the route. It lives here so
 * none of those three has to import a module belonging to another runtime.
 */

/** Fee breakdown as GHN returns it, in VND. */
export interface GhnFeeBreakdown {
  total: number;
  service_fee: number;
  insurance_fee: number;
  cod_fee: number;
  pick_station_fee: number;
  coupon_value: number;
  r2s_fee: number;
  pick_remote_areas_fee: number;
  deliver_remote_areas_fee: number;
}

/** One seller's parcel, as sent by the browser. */
export interface ShipmentQuoteRequest {
  /** Correlation key echoed back in the response — the seller id at call sites. */
  id: string;
  from_district_id: number;
  from_ward_code: string;
  /** Total parcel weight in grams. */
  weight?: number;
  service_type_id?: number;
  /** Declared value in VND, used by GHN to price insurance. */
  insurance_value?: number;
}

/** A priced shipment, straight off GHN and not yet formatted for display. */
export interface ShipmentQuote {
  service_id: number;
  service_type_id: number;
  short_name: string;
  service_name: string;
  fee: GhnFeeBreakdown;
  /** UNIX timestamp in seconds for the expected delivery date. */
  leadtime: number;
}

export interface ShipmentQuoteResult {
  id: string;
  ok: boolean;
  data?: ShipmentQuote;
  error?: string;
}

export interface ShipmentQuoteResponse {
  success: boolean;
  message?: string;
  results?: ShipmentQuoteResult[];
}

export interface ShipmentQuotes {
  /** Successful quotes, keyed by the `id` supplied in the request. */
  options: Record<string, ShippingServiceOption>;
  /** Per-shipment failure messages, keyed the same way. */
  errors: Record<string, string>;
}
