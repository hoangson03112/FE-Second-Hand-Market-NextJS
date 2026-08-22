import { NextRequest, NextResponse } from "next/server";
import {
  GhnError,
  calculateFee,
  calculateLeadtime,
  getAvailableServices,
  isGhnConfigured,
} from "@/lib/server/ghn";
import type { ShipmentQuote, ShipmentQuoteResult } from "@/types/shipping";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SHIPMENTS = 20;
const MIN_WEIGHT_G = 100;
const MAX_WEIGHT_G = 30_000;
const DEFAULT_WEIGHT_G = 500;

interface ShipmentInput {
  id?: unknown;
  from_district_id?: unknown;
  from_ward_code?: unknown;
  weight?: unknown;
  service_type_id?: unknown;
  insurance_value?: unknown;
}

interface QuoteBody {
  to_district_id?: unknown;
  to_ward_code?: unknown;
  shipments?: unknown;
}

function toPositiveInt(value: unknown): number | null {
  const parsed =
    typeof value === "number" ? value : parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : null;
}

function clampWeight(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_WEIGHT_G;
  return Math.min(MAX_WEIGHT_G, Math.max(MIN_WEIGHT_G, Math.round(parsed)));
}

function errorMessage(error: unknown): string {
  if (error instanceof GhnError) return error.message;
  if (error instanceof Error) return error.message;
  return "Không tính được phí vận chuyển";
}

async function quoteShipment(
  shipment: ShipmentInput,
  toDistrictId: number,
  toWardCode: string,
): Promise<ShipmentQuote> {
  const fromDistrictId = toPositiveInt(shipment.from_district_id);
  const fromWardCode = String(shipment.from_ward_code ?? "").trim();

  if (!fromDistrictId || !fromWardCode) {
    throw new Error("Người bán chưa cấu hình địa chỉ gửi hàng.");
  }

  const services = await getAvailableServices(fromDistrictId, toDistrictId);
  if (!services.length) {
    throw new Error(
      "Không có phương thức vận chuyển khả dụng cho địa chỉ này.",
    );
  }

  const requestedType = toPositiveInt(shipment.service_type_id);
  const service =
    (requestedType
      ? services.find((s) => s.service_type_id === requestedType)
      : undefined) ?? services[0];

  const weight = clampWeight(shipment.weight);
  const insuranceValue = toPositiveInt(shipment.insurance_value) ?? undefined;

  const [fee, leadtime] = await Promise.all([
    calculateFee({
      from_district_id: fromDistrictId,
      from_ward_code: fromWardCode,
      to_district_id: toDistrictId,
      to_ward_code: toWardCode,
      weight,
      service_type_id: service.service_type_id,
      insurance_value: insuranceValue,
    }),
    calculateLeadtime({
      from_district_id: fromDistrictId,
      from_ward_code: fromWardCode,
      to_district_id: toDistrictId,
      to_ward_code: toWardCode,
      service_id: service.service_id,
    }),
  ]);

  return {
    service_id: service.service_id,
    service_type_id: service.service_type_id,
    short_name: service.short_name || "Giao hàng",
    service_name: service.service_name || service.short_name || "Giao hàng",
    fee,
    leadtime: leadtime.leadtime,
  };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!isGhnConfigured()) {
    return NextResponse.json(
      { success: false, message: "GHN chưa được cấu hình trên máy chủ." },
      { status: 500 },
    );
  }

  const body = (await req.json().catch(() => null)) as QuoteBody | null;
  const toDistrictId = toPositiveInt(body?.to_district_id);
  const toWardCode = String(body?.to_ward_code ?? "").trim();
  const shipments = Array.isArray(body?.shipments) ? body.shipments : [];

  if (!toDistrictId || !toWardCode) {
    return NextResponse.json(
      { success: false, message: "Địa chỉ nhận hàng không hợp lệ." },
      { status: 400 },
    );
  }
  if (!shipments.length) {
    return NextResponse.json({ success: true, results: [] });
  }
  if (shipments.length > MAX_SHIPMENTS) {
    return NextResponse.json(
      { success: false, message: "Quá nhiều người bán trong một đơn." },
      { status: 400 },
    );
  }

  const settled = await Promise.allSettled(
    (shipments as ShipmentInput[]).map((shipment) =>
      quoteShipment(shipment, toDistrictId, toWardCode),
    ),
  );

  const results: ShipmentQuoteResult[] = settled.map((outcome, index) => {
    const id = String((shipments as ShipmentInput[])[index]?.id ?? index);
    if (outcome.status === "fulfilled") {
      return { id, ok: true, data: outcome.value };
    }
    return { id, ok: false, error: errorMessage(outcome.reason) };
  });

  return NextResponse.json({ success: true, results });
}
