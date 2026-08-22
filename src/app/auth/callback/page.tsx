import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_COOKIE } from "@/lib/session";
import GoogleCallbackClient from "./GoogleCallbackClient";

export default async function GoogleCallbackPage() {
  const hasSession = (await cookies()).has(SESSION_COOKIE);

  if (!hasSession) {
    redirect("/login?error=google_failed");
  }

  return <GoogleCallbackClient />;
}
