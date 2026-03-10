import { IconTrendingUp } from "@tabler/icons-react";

interface ActivityRow {
  day: string;
  listings: number;
  purchases: number;
}

interface ActivityTableProps {
  data: ActivityRow[];
}

export default function ActivityTable({ data }: ActivityTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <IconTrendingUp className="h-4 w-4" />
        Hoạt động 7 ngày qua
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="pb-2 pr-4 font-medium">Ngày</th>
              <th className="pb-2 pr-4 font-medium">Sản phẩm đăng</th>
              <th className="pb-2 font-medium">Đơn giao</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                className="border-b border-border/50 last:border-0"
              >
                <td className="py-2 pr-4 text-foreground">{row.day}</td>
                <td className="py-2 pr-4">{row.listings}</td>
                <td className="py-2">{row.purchases}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
