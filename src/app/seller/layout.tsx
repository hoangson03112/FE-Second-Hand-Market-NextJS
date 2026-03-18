import Link from "next/link";
import {
  IconLayoutDashboard,
  IconPackage,
  IconTruck,
  IconCurrencyDong,
} from "@tabler/icons-react";

const navItems = [
  { href: "/seller", icon: IconLayoutDashboard, label: "Tổng quan" },
  { href: "/seller/orders", icon: IconTruck, label: "Đơn hàng" },
  { href: "/my/listings", icon: IconPackage, label: "Sản phẩm" },
  { href: "/seller/payouts", icon: IconCurrencyDong, label: "Ví & Thanh toán" },
];

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-cream-50/30 to-background">
      <aside className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-40">
        <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      {children}
    </div>
  );
}
