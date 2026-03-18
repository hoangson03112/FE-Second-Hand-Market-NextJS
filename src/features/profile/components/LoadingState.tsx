import { PROFILE_MESSAGES } from "@/constants";

export function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-cream-50/30 to-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full h-12 w-12 border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">{PROFILE_MESSAGES.LOADING}</p>
      </div>
    </div>
  );
}
