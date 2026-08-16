import type { GhnFeeBreakdown } from "@/types/shipping";

/**
 * Server-side GHN client used by the Route Handlers under `/api`.
 *
 * Running GHN traffic here instead of from the browser buys three things:
 * the secret Token never reaches the client bundle, responses are cached across
 * every user (service lists for a route are effectively static), and identical
 * in-flight calls collapse into a single upstream request.
 */

const GHN_API_URL =
  process.env.GHN_API_URL ??
  "https://dev-online-gateway.ghn.vn/shiip/public-api";
const GHN_TOKEN = process.env.GHN_TOKEN;
const GHN_SHOP_ID = process.env.GHN_SHOP_ID;

/** GHN's dev gateway routinely stalls; fail fast instead of holding the socket. */
const UPSTREAM_TIMEOUT_MS = 8000;

export const CACHE_TTL = {
  /** Which services serve a district pair changes on the order of months. */
  availableServices: 6 * 60 * 60 * 1000,
  /** Tariffs are stable within a checkout session but not worth pinning longer. */
  fee: 5 * 60 * 1000,
  leadtime: 30 * 60 * 1000,
} as const;

export interface GhnEnvelope<T> {
  code: number;
  message?: string;
  data: T;
}

export interface GhnAvailableService {
  service_id: number;
  short_name: string;
  service_type_id: number;
  service_name?: string;
}

export interface GhnLeadtime {
  leadtime: number;
}

export class GhnError extends Error {
  readonly code: number;

  constructor(message: string, code: number) {
    super(message);
    this.name = "GhnError";
    this.code = code;
  }
}

export function isGhnConfigured(): boolean {
  return Boolean(GHN_TOKEN);
}

// ---------------------------------------------------------------------------
// Cache + in-flight dedup
// ---------------------------------------------------------------------------

interface CacheEntry {
  value: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<unknown>>();

/**
 * GHN keys are low cardinality (district pairs), but this module lives for the
 * whole process lifetime so the map still needs a ceiling.
 */
const MAX_CACHE_ENTRIES = 1000;

function readCache<T>(key: string): T | undefined {
  const hit = cache.get(key);
  if (!hit) return undefined;
  if (hit.expiresAt <= Date.now()) {
    cache.delete(key);
    return undefined;
  }
  return hit.value as T;
}

function writeCache(key: string, value: unknown, ttlMs: number): void {
  if (cache.size >= MAX_CACHE_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

// ---------------------------------------------------------------------------
// Transport
// ---------------------------------------------------------------------------

async function postOnce<T>(
  path: string,
  body: Record<string, unknown>
): Promise<GhnEnvelope<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Token: GHN_TOKEN as string,
  };
  // GHN requires ShopId on the fee/leadtime endpoints; sending it everywhere is
  // harmless and keeps this in step with the backend's own GHN calls.
  if (GHN_SHOP_ID) headers.ShopId = GHN_SHOP_ID;

  let res: Response;
  try {
    res = await fetch(`${GHN_API_URL}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (error) {
    const reason =
      error instanceof Error && error.name === "TimeoutError"
        ? "GHN không phản hồi kịp thời"
        : "Không kết nối được tới GHN";
    throw new GhnError(reason, 504);
  }

  const payload = (await res
    .json()
    .catch(() => null)) as GhnEnvelope<T> | null;

  if (!res.ok || !payload) {
    throw new GhnError(
      payload?.message || `GHN trả về lỗi ${res.status}`,
      res.status
    );
  }
  if (payload.code !== 200 || payload.data == null) {
    throw new GhnError(payload.message || `GHN trả về mã ${payload.code}`, 502);
  }

  return payload;
}

/**
 * One retry, and only for failures that a retry can actually fix — a 400 from
 * GHN means the payload is wrong and repeating it just doubles the latency.
 */
async function post<T>(
  path: string,
  body: Record<string, unknown>
): Promise<T> {
  try {
    return (await postOnce<T>(path, body)).data;
  } catch (error) {
    const retryable =
      error instanceof GhnError && (error.code === 504 || error.code >= 500);
    if (!retryable) throw error;
    return (await postOnce<T>(path, body)).data;
  }
}

/**
 * Cached POST. Concurrent callers with the same key share a single upstream
 * request rather than each firing their own.
 */
async function cachedPost<T>(
  key: string,
  ttlMs: number,
  path: string,
  body: Record<string, unknown>
): Promise<T> {
  const cached = readCache<T>(key);
  if (cached !== undefined) return cached;

  const pending = inFlight.get(key) as Promise<T> | undefined;
  if (pending) return pending;

  const promise = post<T>(path, body)
    .then((value) => {
      writeCache(key, value, ttlMs);
      return value;
    })
    .finally(() => {
      inFlight.delete(key);
    });

  inFlight.set(key, promise);
  return promise;
}

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

export function getAvailableServices(
  fromDistrictId: number,
  toDistrictId: number
): Promise<GhnAvailableService[]> {
  return cachedPost<GhnAvailableService[]>(
    `services:${fromDistrictId}:${toDistrictId}`,
    CACHE_TTL.availableServices,
    "/v2/shipping-order/available-services",
    {
      shop_id: GHN_SHOP_ID ? Number(GHN_SHOP_ID) : undefined,
      from_district: fromDistrictId,
      to_district: toDistrictId,
    }
  );
}

export function calculateFee(params: {
  from_district_id: number;
  from_ward_code: string;
  to_district_id: number;
  to_ward_code: string;
  weight: number;
  service_type_id: number;
  insurance_value?: number;
}): Promise<GhnFeeBreakdown> {
  const key = `fee:${params.from_district_id}:${params.from_ward_code}:${params.to_district_id}:${params.to_ward_code}:${params.weight}:${params.service_type_id}:${params.insurance_value ?? 0}`;
  return cachedPost<GhnFeeBreakdown>(
    key,
    CACHE_TTL.fee,
    "/v2/shipping-order/fee",
    params
  );
}

export function calculateLeadtime(params: {
  from_district_id: number;
  from_ward_code: string;
  to_district_id: number;
  to_ward_code: string;
  service_id: number;
}): Promise<GhnLeadtime> {
  const key = `leadtime:${params.from_district_id}:${params.from_ward_code}:${params.to_district_id}:${params.to_ward_code}:${params.service_id}`;
  return cachedPost<GhnLeadtime>(
    key,
    CACHE_TTL.leadtime,
    "/v2/shipping-order/leadtime",
    params
  );
}
