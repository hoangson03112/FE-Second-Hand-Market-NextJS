import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side proxy for the GHN (GiaoHangNhanh) API.
 *
 * The GHN `Token` is a secret and must never reach the browser bundle, so all
 * GHN calls from the client go through this Route Handler instead of hitting
 * GHN directly. The token (and shop id) are read from server-only env vars and
 * injected here.
 *
 * Client base URL: `/api/ghn`  ->  forwarded to `${GHN_API_URL}/<path>`.
 */

const GHN_API_URL =
  process.env.GHN_API_URL ??
  "https://dev-online-gateway.ghn.vn/shiip/public-api";
const GHN_TOKEN = process.env.GHN_TOKEN;
const GHN_SHOP_ID = process.env.GHN_SHOP_ID;

// GHN endpoints that require the shop id in the request body.
const SHOP_ID_ENDPOINTS = ["available-services"];

async function proxy(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
  if (!GHN_TOKEN) {
    return NextResponse.json(
      { code: 500, message: "GHN token is not configured on the server" },
      { status: 500 }
    );
  }

  const { path } = await ctx.params;
  const joinedPath = path.join("/");
  const target = `${GHN_API_URL}/${joinedPath}${req.nextUrl.search}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Token: GHN_TOKEN,
  };

  let body: string | undefined;
  if (req.method === "POST") {
    const json = (await req.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;

    // Inject the shop id for endpoints that need it, so the client never has to
    // know it.
    if (
      GHN_SHOP_ID &&
      json &&
      typeof json === "object" &&
      !("shop_id" in json) &&
      SHOP_ID_ENDPOINTS.some((endpoint) => joinedPath.includes(endpoint))
    ) {
      json.shop_id = Number(GHN_SHOP_ID);
    }

    body = JSON.stringify(json);
  }

  // Without a deadline a stalled GHN holds this handler's socket open for as
  // long as GHN wants; the browser gives up at 8s either way.
  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: req.method,
      headers,
      body,
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    return NextResponse.json(
      { code: 504, message: "GHN không phản hồi kịp thời" },
      { status: 504 }
    );
  }

  const data = await upstream.json().catch(() => null);
  return NextResponse.json(data, { status: upstream.status });
}

export const GET = proxy;
export const POST = proxy;
