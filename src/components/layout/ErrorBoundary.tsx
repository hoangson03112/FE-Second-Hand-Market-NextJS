"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-luxury-ivory p-4">
          <div className="max-w-md w-full bg-white rounded-[2px] border border-luxury-ink/10 p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-[2px] bg-cream-50 border border-luxury-ink/10 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-luxury-ink"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="space-y-1.5">
              <h2 className="font-droid-serif text-2xl font-bold text-luxury-ink">
                Đã có sự cố xảy ra
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Đã xảy ra lỗi không mong muốn trong quá trình kết xuất giao diện. Vui lòng tải lại trang hoặc thử lại sau.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full py-3 px-6 bg-luxury-ink text-luxury-ivory text-2xs font-bold uppercase tracking-[0.14em] rounded-[2px] hover:bg-charcoal-800 transition-colors"
              >
                Tải lại trang
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
