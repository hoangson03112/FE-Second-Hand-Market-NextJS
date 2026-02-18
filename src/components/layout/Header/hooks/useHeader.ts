import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import useCategories from "@/hooks/useCategories";
import { useUser } from "@/hooks/useUser";
import { useCart } from "@/hooks/useCart";
import { useTokenStore } from "@/store/useTokenStore";
import { AuthService } from "@/services/auth.service";
import { SellerService } from "@/services/seller.service";

function getInitials(name?: string) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function useHeader() {
  const router = useRouter();
  const { clearAuth } = useTokenStore();
  const { data: categories, isLoading } = useCategories();
  const { data: account } = useUser();
  const { itemCount: cartItemCount } = useCart();
  const accessToken = useTokenStore((state) => state.accessToken);

  // Check product limit to determine if user can post products
  const { data: productLimit } = useQuery({
    queryKey: ["seller", "product-limit"],
    queryFn: () => SellerService.getProductLimit(),
    enabled: !!accessToken && !!account && account.role !== "seller",
    staleTime: 60000, // 1 minute
  });

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const categoryLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const allCategoriesLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const visibleCategories = useMemo(
    () => categories?.slice(0, 7),
    [categories]
  );

  const handleMouseEnterCategory = useCallback((id: string) => {
    // Clear any pending hide timeout
    if (categoryLeaveTimeoutRef.current) {
      clearTimeout(categoryLeaveTimeoutRef.current);
      categoryLeaveTimeoutRef.current = null;
    }
    setActiveCategory(id);
  }, []);

  const handleMouseLeaveCategory = useCallback(() => {
    // Add delay before hiding dropdown
    categoryLeaveTimeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 200); // 500ms delay - easier to move mouse
  }, []);

  const handleShowAllCategories = useCallback(() => {
    // Clear any pending hide timeout
    if (allCategoriesLeaveTimeoutRef.current) {
      clearTimeout(allCategoriesLeaveTimeoutRef.current);
      allCategoriesLeaveTimeoutRef.current = null;
    }
    setShowAllCategories(true);
  }, []);

  const handleHideAllCategories = useCallback(() => {
    // Add delay before hiding dropdown
    allCategoriesLeaveTimeoutRef.current = setTimeout(() => {
      setShowAllCategories(false);
    }, 200); // 500ms delay - easier to move mouse
  }, []);

  const handleSearch = useCallback(
    (q?: string) => {
      if (q && q.length) {
        router.push(`/search?q=${encodeURIComponent(q)}`);
      }
    },
    [router]
  );

  const submitSearch = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (query.trim()) handleSearch(query.trim());
    },
    [query, handleSearch]
  );

  const toggleUserDropdown = useCallback(() => {
    setShowUserDropdown((prev) => !prev);
  }, []);

  const closeUserDropdown = useCallback(() => {
    setShowUserDropdown(false);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuth();
      setShowUserDropdown(false);
      window.location.href = "/";
    }
  }, [clearAuth]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Cleanup timeouts on unmount
      if (categoryLeaveTimeoutRef.current) {
        clearTimeout(categoryLeaveTimeoutRef.current);
      }
      if (allCategoriesLeaveTimeoutRef.current) {
        clearTimeout(allCategoriesLeaveTimeoutRef.current);
      }
    };
  }, [showUserDropdown]);

  // Determine sell button text and href
  const canPostProducts = useMemo(() => {
    if (!account) return false;
    if (account.role === "seller") return true;
    if (productLimit) {
      return !productLimit.requiresVerification;
    }
    return false; // Default to false while loading
  }, [account, productLimit]);

  const sellButtonHref = useMemo(() => {
    if (!account) return "/login";
    if (canPostProducts) return "/sell";
    return "/become-seller";
  }, [account, canPostProducts]);

  const sellButtonText = useMemo(() => {
    if (!account) return "Đăng nhập";
    if (canPostProducts) return "Đăng sản phẩm";
    return "Đăng ký bán hàng";
  }, [account, canPostProducts]);

  return {
    account,
    categories: categories ?? [],
    isLoading,
    visibleCategories: visibleCategories ?? [],
    activeCategory,
    showAllCategories,
    cartItemCount: cartItemCount ?? 0,
    query,
    setQuery,
    showUserDropdown,
    dropdownRef,
    handleMouseEnterCategory,
    handleMouseLeaveCategory,
    handleShowAllCategories,
    handleHideAllCategories,
    submitSearch,
    toggleUserDropdown,
    closeUserDropdown,
    handleLogout,
    getInitials,
    sellButtonHref,
    sellButtonText,
  };
}
