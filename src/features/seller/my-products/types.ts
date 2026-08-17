import type { ProductStatusFilter } from "@/types/product";

export interface StatusConfig {
  label: string;
  dot: string;
  text: string;
}

export type StatusConfigMap = Record<ProductStatusFilter, StatusConfig>;
