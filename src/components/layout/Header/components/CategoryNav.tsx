import { IconChevronDown } from "@tabler/icons-react";
import Link from "next/link";
import { ICategory, ISubCategory } from "@/types/category";

interface CategoryNavProps {
  isLoading: boolean;
  categories: ICategory[];
  activeCategory: string | null;
  onMouseEnterCategory: (id: string) => void;
  onMouseLeaveCategory: () => void;
}

export function CategoryNav({
  isLoading,
  categories,
  activeCategory,
  onMouseEnterCategory,
  onMouseLeaveCategory,
}: CategoryNavProps) {
  return (
    <nav className="hidden lg:flex flex-1 items-center gap-0 xl:gap-0.5 min-w-0">
      {isLoading ? (
        <div className="flex items-center gap-1.5 px-2 text-muted-foreground">
          <div
            className="w-2.5 h-2.5 border-2 rounded-full animate-spin border-border border-t-primary"
          />
        </div>
      ) : (
        categories.map((category: ICategory) => (
          <div
            key={category._id}
            className="relative shrink-0"
            onMouseEnter={() => category.subCategories?.length > 0 && onMouseEnterCategory(category._id)}
            onMouseLeave={onMouseLeaveCategory}
          >
            <Link
              href={`/categories/${category.slug}`}
              className={`flex items-center gap-0.5 px-2 xl:px-2.5 py-1 text-[12px] xl:text-[12.5px] font-medium whitespace-nowrap rounded-full transition-all duration-150 max-w-[132px] xl:max-w-none hover:bg-primary/10 hover:text-foreground ${activeCategory === category._id ? "bg-primary/15 text-foreground font-semibold" : "text-neutral-700"}`}
            >
              <span className="truncate">{category.name}</span>
              {category.subCategories?.length > 0 && (
                <IconChevronDown
                  className={`w-3 h-3 shrink-0 transition-transform duration-200 ${
                    activeCategory === category._id ? "rotate-180" : ""
                  }`}
                  strokeWidth={2.5}
                />
              )}
            </Link>

            {activeCategory === category._id && category.subCategories?.length > 0 && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 w-52">
                <div
                  style={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "14px",
                    boxShadow: "0 12px 36px rgba(26,23,20,0.12)",
                  }}
                >
                  <div className="px-4 pt-3 pb-2 border-b border-border">
                    <p className="text-[11px] font-semibold text-primary">
                      {category.name}
                    </p>
                  </div>
                  <div className="py-2 px-2 max-h-72 overflow-y-auto custom-scrollbar">
                    {category.subCategories.map((sub: ISubCategory) => (
                      <Link
                        key={sub._id}
                        href={`/categories/${category.slug}/sub/${sub.slug}`}
                        className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium rounded-lg transition-colors text-foreground hover:bg-primary/10 hover:text-foreground"
                        role="menuitem"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0 bg-primary/45"
                        />
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </nav>
  );
}
