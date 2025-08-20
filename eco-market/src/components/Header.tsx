"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type User = {
  name?: string;
  avatarUrl?: string;
};

type HeaderProps = {
  user?: User | null;
  cartCount?: number;
  favoritesCount?: number;
  notificationsCount?: number;
  onSearch?: (q: string) => void;
};

export default function Header({
  user = null,
  cartCount = 0,
  favoritesCount = 0,
  notificationsCount = 0,
  onSearch,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  function submitSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (onSearch) onSearch(query);
  }

  return (
    <header className="header">
      <div className="container">
        <div className="left">
          <Link href="/" className="logo">
            <span className="logo-accent">Eco</span>Market
          </Link>
        </div>

        <form className="search" onSubmit={submitSearch} role="search">
          <input
            aria-label="Search listings"
            placeholder="Tìm kiếm: điện thoại, bàn ghế..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn" aria-label="Search">
            🔍
          </button>
        </form>

        <nav className="nav">
          <Link href="/sell" className="nav-link">
            Đăng bán
          </Link>
          <Link href="/favorites" className="nav-icon" aria-label="Favorites">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="icon"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
            </svg>
            {favoritesCount > 0 && (
              <span className="badge">{favoritesCount}</span>
            )}
          </Link>

          <Link
            href="/notifications"
            className="nav-icon"
            aria-label="Notifications"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="icon"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {notificationsCount > 0 && (
              <span className="badge">{notificationsCount}</span>
            )}
          </Link>

          <Link href="/cart" className="nav-icon" aria-label="Cart">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="icon"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6H19M10 21a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="user">
              <Image
                className="avatar"
                src={user.avatarUrl || "/default-avatar.png"}
                alt={user.name || "User avatar"}
                width={36}
                height={36}
              />
              <span className="username">{user.name || "Bạn"}</span>
            </div>
          ) : (
            <Link href="/login" className="login-btn">
              Đăng nhập
            </Link>
          )}
        </nav>

        <button
          className="mobile-toggle"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((s) => !s)}
        >
          <span className="hamburger">{mobileOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-menu">
          <Link href="/sell" className="mobile-link">
            Đăng bán
          </Link>
          <Link href="/favorites" className="mobile-link">
            Yêu thích ({favoritesCount})
          </Link>
          <Link href="/notifications" className="mobile-link">
            Thông báo ({notificationsCount})
          </Link>
          <Link href="/cart" className="mobile-link">
            Giỏ hàng ({cartCount})
          </Link>
          {user ? (
            <Link href="/profile" className="mobile-link">
              Hồ sơ
            </Link>
          ) : (
            <Link href="/login" className="mobile-link">
              Đăng nhập
            </Link>
          )}
        </div>
      )}

      <style jsx>{`
        .header {
          background: #ffffff;
          border-bottom: 1px solid #eef2f6;
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: 0 1px 0 rgba(16, 24, 40, 0.02);
        }
        .container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1100px;
          margin: 0 auto;
          padding: 12px 18px;
        }
        .left .logo {
          font-weight: 800;
          font-size: 20px;
          color: #0f172a;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .logo-accent {
          color: #059669;
        }
        .search {
          display: flex;
          align-items: center;
          flex: 1;
          max-width: 640px;
          margin: 0 14px;
          background: #fff;
          border-radius: 9px;
          box-shadow: 0 4px 10px rgba(15, 23, 42, 0.05);
          overflow: hidden;
        }
        .search-input {
          flex: 1;
          padding: 10px 14px;
          border: none;
          outline: none;
          font-size: 14px;
        }
        .search-input::placeholder {
          color: #94a3b8;
        }
        .search-btn {
          padding: 10px 12px;
          border: none;
          background: linear-gradient(180deg, #10b981, #059669);
          color: white;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .nav {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .nav-link {
          text-decoration: none;
          color: #0f172a;
          padding: 6px 10px;
          border-radius: 8px;
          font-weight: 600;
          transition: background 120ms, color 120ms, transform 120ms;
        }
        .nav-link:hover {
          background: rgba(6, 182, 212, 0.06);
          color: #036b70;
          transform: translateY(-1px);
        }
        .nav-icon {
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: 8px;
          border-radius: 8px;
          text-decoration: none;
          color: #0f172a;
          transition: background 120ms, transform 120ms;
        }
        .nav-icon:hover {
          background: rgba(15, 23, 42, 0.04);
          transform: translateY(-1px);
        }
        .icon {
          font-size: 16px;
          display: inline-block;
        }
        .badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          padding: 1px 5px;
          border-radius: 10px;
          box-shadow: 0 1px 4px rgba(239, 68, 68, 0.16);
        }
        .user {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .avatar {
          border-radius: 999px;
          border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(2, 6, 23, 0.08);
        }
        .username {
          font-size: 13px;
          color: #0f172a;
          font-weight: 600;
        }
        .login-btn {
          padding: 8px 12px;
          background: linear-gradient(180deg, #06b6d4, #0891b2);
          color: white;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
        }
        .mobile-toggle {
          display: none;
          background: transparent;
          border: none;
          padding: 6px;
        }
        .mobile-toggle .hamburger {
          font-size: 20px;
          display: inline-block;
          background: #f8fafc;
          padding: 6px 8px;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(2, 6, 23, 0.06);
        }
        .mobile-menu {
          display: none;
        }

        @media (max-width: 800px) {
          .container {
            padding: 10px 12px;
          }
          .search {
            display: none;
          }
          .mobile-toggle {
            display: block;
          }
          .nav {
            gap: 8px;
          }
          .mobile-menu {
            display: flex;
            flex-direction: column;
            padding: 8px 10px;
            border-top: 1px solid #f1f5f9;
            background: #fff;
            box-shadow: 0 8px 24px rgba(2, 6, 23, 0.06);
            gap: 6px;
          }
          .mobile-link {
            padding: 10px 8px;
            text-decoration: none;
            color: #0f172a;
            border-radius: 8px;
            background: transparent;
          }
          .mobile-link:hover {
            background: rgba(15, 23, 42, 0.03);
          }
        }
      `}</style>
    </header>
  );
}
