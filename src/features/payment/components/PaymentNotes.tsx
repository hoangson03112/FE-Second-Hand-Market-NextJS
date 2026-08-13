export function PaymentNotes() {
  return (
    <div className="bg-sky-50 border-2 border-sky-200 rounded-xl p-4">
      <h3 className="font-semibold text-sky-900 mb-2 text-sm uppercase tracking-wide">Lưu ý:</h3>
      <ul className="text-sm text-sky-800 space-y-1 list-disc list-inside">
        <li>Vui lòng chuyển khoản đúng số tiền và nội dung như trên</li>
        <li>Đơn hàng sẽ được xử lý sau khi nhận được thanh toán</li>
        <li>Thời gian xử lý: 1-2 giờ làm việc</li>
      </ul>
    </div>
  );
}