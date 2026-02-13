import { Loader2 } from "lucide-react";
import { PROFILE_MESSAGES } from "@/constants";

export function LoadingState() {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">{PROFILE_MESSAGES.LOADING}</p>
      </div>
    </div>
  );
}
