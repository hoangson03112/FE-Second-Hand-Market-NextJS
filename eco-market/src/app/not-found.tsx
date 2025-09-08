import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-md w-full mx-4">
        <div className="text-center space-y-8">
          {/* 404 Illustration */}
          <div className="relative">
            <div className="text-8xl font-extralight text-slate-300 mb-4">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-3xl font-light text-slate-800">
              Trang không tồn tại
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
              <br />
              Có thể đường dẫn đã bị thay đổi hoặc không còn tồn tại.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center w-full px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold rounded-xl hover:from-slate-800 hover:to-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Về trang chủ
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center w-full px-8 py-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-300"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Quay lại trang trước
            </button>
          </div>

          {/* Help Links */}
          <div className="pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-4">
              Hoặc bạn có thể tìm kiếm:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                href="/products"
                className="text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                Sản phẩm
              </Link>
              <Link
                href="/categories"
                className="text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                Danh mục
              </Link>
              <Link
                href="/help"
                className="text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                Trợ giúp
              </Link>
              <Link
                href="/contact"
                className="text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                Liên hệ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




