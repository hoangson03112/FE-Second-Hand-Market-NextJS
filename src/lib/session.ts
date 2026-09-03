

export const SESSION_COOKIE = "refreshToken";


export const SESSION_CHANGED_EVENT = "eco:session-changed";


export const SESSION_CHANNEL = "eco:session";

export type SessionSignal = "signed-in" | "signed-out";


export function announceSession(signal: SessionSignal): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<SessionSignal>(SESSION_CHANGED_EVENT, { detail: signal }),
  );

  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    const channel = new BroadcastChannel(SESSION_CHANNEL);
    channel.postMessage(signal);
    channel.close();
  }
}


export function notifySessionLost(): void {
  if (typeof window === "undefined") return;
  announceSession("signed-out");
}
