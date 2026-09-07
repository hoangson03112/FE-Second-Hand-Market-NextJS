import type { ShippingServiceOption } from "./address";


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


export interface ShipmentQuoteRequest {

  id: string;
  from_district_id: number;
  from_ward_code: string;

  weight?: number;
  service_type_id?: number;

  insurance_value?: number;
}


export interface ShipmentQuote {
  service_id: number;
  service_type_id: number;
  short_name: string;
  service_name: string;
  fee: GhnFeeBreakdown;

  leadtime?: number;
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

  options: Record<string, ShippingServiceOption>;

  errors: Record<string, string>;
}
