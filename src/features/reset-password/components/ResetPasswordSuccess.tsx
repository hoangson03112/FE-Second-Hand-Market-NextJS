import Link from "next/link";
import { IconCircleCheck } from "@tabler/icons-react";
import SuccessMessage from "@/components/common/auth/SuccessMessage";
import InfoBox from "@/components/common/auth/InfoBox";
import { ArrowRightIcon } from "@/components/ui/icons/ArrowRightIcon";

export default function ResetPasswordSuccess() {
  return (
    <div className="space-y-6">
      <SuccessMessage
        icon={<IconCircleCheck className="w-10 h-10 text-primary" />}
        title="Mật khẩu đã được thay đổi!"
        description="Bạn có thể đăng nhập vào tài khoản với mật khẩu mới ngay bây giờ."
      />

      <InfoBox variant="success" title="✅ Bảo mật:">
        Email xác nhận đã được gửi đến hộp thư của bạn.
      </InfoBox>

      <div className="pt-4">
        <Link
          href="/login"
          className="btn-auth-primary flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all"
        >
          <span>Đăng nhập ngay</span>
          <ArrowRightIcon className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
