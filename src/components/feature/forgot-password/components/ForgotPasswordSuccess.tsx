import Link from "next/link";
import { IconMail } from "@tabler/icons-react";
import SuccessMessage from "@/components/common/auth/SuccessMessage";
import EmailSentTips from "@/components/common/auth/EmailSentTips";

interface ForgotPasswordSuccessProps {
  email: string;
  onResend: () => void;
}

export default function ForgotPasswordSuccess({ email, onResend }: ForgotPasswordSuccessProps) {
  return (
    <div className="space-y-6">
      <SuccessMessage
        icon={<IconMail className="w-10 h-10 text-primary" />}
        title="Kiểm tra email của bạn"
        description={
          <>
            Chúng tôi đã gửi link reset mật khẩu đến <strong className="text-primary">{email}</strong>
          </>
        }
        hint="Link sẽ hết hạn sau 15 phút"
      />

      <EmailSentTips />

      <div className="pt-4 space-y-3">
        <button
          onClick={onResend}
          className="w-full py-3 px-4 bg-primary/10 text-primary rounded-xl font-semibold hover:bg-primary/20 transition-colors"
        >
          Gửi lại email
        </button>

        <Link
          href="/login"
          className="block text-center text-sm text-taupe-600 hover:text-primary transition-colors"
        >
          ← Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}
