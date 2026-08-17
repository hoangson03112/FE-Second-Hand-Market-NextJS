import { Eyebrow } from "@/features/order/components";

const notes = [
  "Chuyển đúng số tiền và giữ nguyên nội dung chuyển khoản.",
  "Đơn hàng được xử lý ngay sau khi admin xác nhận đã nhận tiền.",
  "Thời gian xử lý thông thường: 1–2 giờ làm việc.",
];

export function PaymentNotes() {
  return (
    <div className="rounded-[2px] border border-luxury-ink/10 bg-cream-50/60 px-5 py-5 sm:px-6">
      <Eyebrow>Lưu ý</Eyebrow>
      <ul className="mt-4 space-y-3">
        {notes.map((note, index) => (
          <li key={note} className="flex gap-3">
            <span
              aria-hidden
              style={{ fontFamily: "var(--font-droid-serif), serif" }}
              className="shrink-0 text-xs italic text-luxury-ink/35"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-xs leading-relaxed text-neutral-700">
              {note}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
