"use client";

/**
 * Last-resort boundary: catches errors thrown by the root layout itself, where
 * `app/error.tsx` cannot render. It replaces the whole document, so it must
 * ship its own <html>/<body> and cannot rely on the app's fonts or CSS
 * variables — styles are inlined on purpose.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="vi">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F7F5F0",
          color: "#1A1816",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "32rem", textAlign: "center" }}>
          <p
            style={{
              fontSize: "10px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.24em",
              color: "#4f4f5a",
              margin: 0,
            }}
          >
            Lỗi hệ thống
          </p>

          <h1
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 400,
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              lineHeight: 1.1,
              margin: "1.5rem 0 0",
            }}
          >
            Ứng dụng không khởi động được.
          </h1>

          <p
            style={{
              fontSize: "0.875rem",
              lineHeight: 1.7,
              color: "#4f4f5a",
              margin: "1rem auto 0",
              maxWidth: "24rem",
            }}
          >
            Vui lòng tải lại trang. Nếu lỗi vẫn tiếp diễn, hãy thử lại sau ít
            phút.
          </p>

          {error.digest ? (
            <p
              style={{
                fontSize: "10px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#7d7d89",
                marginTop: "1.25rem",
              }}
            >
              Mã lỗi · {error.digest}
            </p>
          ) : null}

          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "2.25rem",
              height: "3rem",
              padding: "0 1.75rem",
              border: "none",
              borderRadius: "2px",
              background: "#1A1816",
              color: "#F7F5F0",
              fontSize: "10px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              cursor: "pointer",
            }}
          >
            Tải lại
          </button>
        </div>
      </body>
    </html>
  );
}
