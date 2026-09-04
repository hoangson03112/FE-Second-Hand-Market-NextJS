import Link from "next/link";
import { IconMail, IconArrowLeft } from "@tabler/icons-react";
import SuccessMessage from "@/features/auth/components/SuccessMessage";
import EmailSentTips from "@/features/auth/components/EmailSentTips";

interface ForgotPasswordSuccessProps {
  email: string;
  onResend: () => void;
}

export default function ForgotPasswordSuccess({
  email,
  onResend,
}: ForgotPasswordSuccessProps) {
  return (
    <div className="space-y-6">
      <SuccessMessage
        icon={<IconMail className="w-8 h-8 text-luxury-ink" />}
        title="Kiểm tra hộp thư của bạn"
        description={
          <>
            Chúng tôi đã gửi đường dẫn đặt lại mật khẩu đến địa chỉ{" "}
            <strong className="text-luxury-ink font-semibold">{email}</strong>
          </>
        }
        hint="Đường dẫn có hiệu lực trong vòng 15 phút"
      />

      <EmailSentTips />

      <div className="pt-2 space-y-3">
        <button
          onClick={onResend}
          className="w-full h-11 px-4 border border-luxury-ink/20 text-luxury-ink rounded-[2px] text-xs font-bold uppercase tracking-[0.12em] hover:bg-taupe-50 transition-all"
        >
          Gửi lại email xác nhận
        </button>

        <Link
          href="/login"
          className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 hover:text-luxury-ink transition-colors font-medium py-1"
        >
          <IconArrowLeft className="w-3.5 h-3.5" />
          Quay lại trang đăng nhập
        </Link>
      </div>
    </div>
  );
}
