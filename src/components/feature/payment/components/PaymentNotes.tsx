export function PaymentNotes() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="font-semibold text-blue-900 mb-2">Lưu ý:</h3>
      <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
        <li>Vui lòng chuyển khoản đúng số tiền và nội dung như trên</li>
        <li>Đơn hàng sẽ được xử lý sau khi nhận được thanh toán</li>
        <li>Thời gian xử lý: 1-2 giờ làm việc</li>
      </ul>
    </div>
  );
}
