import { IconMail } from "@tabler/icons-react";

export default function EmailSentTips() {
  return (
    <div className="bg-cream-50/70 border border-luxury-ink/10 rounded-[2px] p-4 space-y-2.5">
      <p className="text-2xs uppercase tracking-[0.14em] font-bold text-luxury-ink flex items-center gap-1.5">
        <IconMail className="w-3.5 h-3.5 text-luxury-ink" />
        Không thấy email gửi đến?
      </p>
      <ul className="text-xs text-neutral-600 space-y-1.5 text-left leading-relaxed">
        <li>• Kiểm tra kỹ trong thư mục Spam hoặc Thư rác (Junk).</li>
        <li>• Đợi từ 1 - 2 phút và làm mới lại hộp thư của bạn.</li>
        <li>• Đảm bảo rằng bạn đã nhập chính xác địa chỉ email đã đăng ký.</li>
      </ul>
    </div>
  );
}
