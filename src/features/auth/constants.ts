export interface AuthHighlight {
  number: string;
  tag: string;
  title: string;
  description: string;
}

export const LOGIN_HIGHLIGHTS: AuthHighlight[] = [
  {
    number: "01",
    tag: "Tuyển chọn",
    title: "Bộ sưu tập được chọn lọc",
    description:
      "Hàng nghìn món đồ đã qua kiểm duyệt, sẵn sàng cho một vòng đời mới.",
  },
  {
    number: "02",
    tag: "Minh bạch",
    title: "Giao dịch rõ ràng",
    description:
      "Xuất xứ, tình trạng và mức giá của mỗi món đồ luôn được công khai.",
  },
  {
    number: "03",
    tag: "Bảo mật",
    title: "Dữ liệu được giữ kín",
    description: "Toàn bộ phiên đăng nhập và thông tin cá nhân đều được mã hóa.",
  },
];

export const REGISTER_HIGHLIGHTS: AuthHighlight[] = [
  {
    number: "01",
    tag: "Cộng đồng",
    title: "Kết nối giá trị thực",
    description:
      "Nơi trao đổi đồ cũ thân thiện, tôn trọng và giữ lại giá trị nguyên bản.",
  },
  {
    number: "02",
    tag: "Bền vững",
    title: "Kéo dài vòng đời sản phẩm",
    description:
      "Mỗi lần mua bán là một lần bạn giảm bớt lãng phí tài nguyên.",
  },
  {
    number: "03",
    tag: "Miễn phí",
    title: "Bắt đầu bán trong vài phút",
    description:
      "Tạo tài khoản, đăng món đồ đầu tiên và tiếp cận người mua ngay hôm nay.",
  },
];

export const AUTH_PANEL_TAGS = [
  "Tuyển chọn kỹ lưỡng",
  "Giao dịch an toàn",
  "Minh bạch 100%",
];
