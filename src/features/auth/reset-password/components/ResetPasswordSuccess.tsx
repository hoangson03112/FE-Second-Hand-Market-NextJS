import Link from "next/link";
import { IconCircleCheck, IconArrowRight } from "@tabler/icons-react";
import SuccessMessage from "@/features/auth/components/SuccessMessage";
import InfoBox from "@/features/auth/components/InfoBox";

export default function ResetPasswordSuccess() {
  return (
    <div className="space-y-6">
      <SuccessMessage
        icon={<IconCircleCheck className="w-8 h-8 text-luxury-ink" />}
        title="Đổi mật khẩu thành công"
        description="Mật khẩu tài khoản của bạn đã được cập nhật thành công. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới."
      />

      <InfoBox variant="success" title="Thông báo bảo mật:">
        Hệ thống đã ghi nhận việc thay đổi mật khẩu và bảo vệ an toàn cho tài khoản của bạn.
      </InfoBox>

      <div className="pt-2">
        <Link
          href="/login"
          className="w-full h-11 px-8 rounded-[2px] bg-luxury-ink text-luxury-ivory uppercase tracking-[0.15em] text-xs font-bold hover:bg-charcoal-800 transition-all inline-flex items-center justify-center gap-2"
        >
          <span>Đăng nhập ngay</span>
          <IconArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
