import { AuthEditorialPanel, AuthFormHeader, AuthShell } from "../components";
import { LOGIN_HIGHLIGHTS } from "../constants";
import LoginForm from "./components/LoginForm";

export default function Login() {
  return (
    <AuthShell
      panel={
        <AuthEditorialPanel
          eyebrow="Nền tảng đồ cũ cao cấp"
          title={
            <>
              Chào mừng
              <span className="block text-accent">trở lại.</span>
            </>
          }
          description="Đăng nhập để tiếp tục hành trình mua bán second-hand — nơi mỗi món đồ đều được tuyển chọn và tôn trọng."
          highlights={LOGIN_HIGHLIGHTS}
        />
      }
    >
      <AuthFormHeader
        eyebrow="Đăng nhập"
        title={
          <>
            Tiếp tục cùng
            <br /> <span className="text-accent">Eco Market</span>
          </>
        }
        description="Nhập thông tin tài khoản của bạn để tiếp tục."
      />
      <LoginForm />
    </AuthShell>
  );
}
