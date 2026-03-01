export default function EmailSentTips() {
  return (
    <div className="bg-cream-50 border border-cream-200 rounded-xl p-4 space-y-3">
      <p className="text-sm text-taupe-600 font-medium">📬 Không thấy email?</p>
      <ul className="text-xs text-taupe-500 space-y-2 text-left">
        <li>• Kiểm tra trong thư mục Spam/Junk</li>
        <li>• Đợi vài phút và tải lại hộp thư</li>
        <li>• Đảm bảo email nhập đúng</li>
      </ul>
    </div>
  );
}
