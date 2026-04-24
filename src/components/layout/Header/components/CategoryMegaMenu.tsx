import { IconAlignLeft, IconChevronDown } from "@tabler/icons-react";
import Link from "next/link";
import { ICategory, ISubCategory } from "@/types/category";

interface CategoryMegaMenuProps {
  categories: ICategory[];
  showAllCategories: boolean;
  onShowAllCategories: () => void;
  onHideAllCategories: () => void;
}

export function CategoryMegaMenu({
  categories,
  showAllCategories,
  onShowAllCategories,
  onHideAllCategories,
}: CategoryMegaMenuProps) {
  return (
    <div
      className="relative shrink-0 hidden xl:block"
      onMouseEnter={onShowAllCategories}
      onMouseLeave={onHideAllCategories}
    >
      <button
        type="button"
        suppressHydrationWarning
        className={`flex items-center gap-1.5 h-8 px-3 text-[12.5px] font-semibold focus:outline-none transition-all duration-150 select-none text-foreground rounded-full ${showAllCategories ? "bg-primary/15" : "bg-primary/8 hover:bg-primary/15"}`}
      >
        <IconAlignLeft className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />
        <span className="inline">Danh mục</span>
        <IconChevronDown
          className={`w-3 h-3 shrink-0 transition-transform duration-200 ${showAllCategories ? "rotate-180" : ""}`}
          strokeWidth={2.5}
        />
      </button>

      {showAllCategories && (
        <div className="absolute left-0 top-full pt-2 z-50 w-[min(1180px,calc(100vw-2rem))]">
          <div
            style={{
              background: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              boxShadow: "0 20px 56px rgba(26,23,20,0.13), 0 4px 16px rgba(26,23,20,0.06)",
            }}
          >
            <div className="py-8 ps-8">
              <p
                className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-1.5 text-primary"
              >
                Danh mục
              </p>
              <h2 className="text-xl font-semibold mb-7 text-foreground">
                Tìm đúng thứ <span className="text-primary">bạn đang cần.</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6 max-h-[min(90vh,580px)] overflow-y-auto custom-scrollbar pr-1">
                {categories.map((category: ICategory, index: number) => (
                  <div key={category._id} className="group min-w-0">
                    <Link
                      href={`/categories/${category.slug}`}
                      className="flex items-center gap-2.5 mb-2 py-1"
                      onClick={onHideAllCategories}
                    >
                      <span
                        className="text-[10px] font-medium tabular-nums shrink-0 text-primary"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="text-[13px] font-semibold truncate transition-colors text-foreground group-hover:text-primary"
                      >
                        {category.name}
                      </span>
                    </Link>
                    <div className="h-px bg-border mb-1.5" />
                    {category.subCategories?.length > 0 && (
                      <div className="space-y-0.5">
                        {category.subCategories.map((sub: ISubCategory) => (
                          <Link
                            key={sub._id}
                            href={`/categories/${category.slug}/sub/${sub.slug}`}
                            onClick={onHideAllCategories}
                            className="flex items-center gap-2 py-1.5 px-2 text-[12px] font-medium rounded-md transition-colors truncate text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                          >
                            <span className="w-1 h-1 rounded-full shrink-0 bg-primary/50" />
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
