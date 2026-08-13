import { cn } from "@/lib/utils";

/** Matches the shape actually returned by PRODUCT_STATUS_CONFIG (see @/constants). */
interface ProductStatusBadgeProps {
  statusCfg: { label: string; color: string; text: string };
  variant?: "grid" | "list";
}

export function ProductStatusBadge({
  statusCfg,
  variant = "list",
}: ProductStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap border-2 shrink-0",
        variant === "grid" && "bg-white/90 backdrop-blur-sm",
        statusCfg.text,
      )}
      style={{
        backgroundColor:
          variant === "list" ? `${statusCfg.color}10` : undefined,
        borderColor: `${statusCfg.color}40`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: statusCfg.color }}
      />
      {statusCfg.label}
    </span>
  );
}
