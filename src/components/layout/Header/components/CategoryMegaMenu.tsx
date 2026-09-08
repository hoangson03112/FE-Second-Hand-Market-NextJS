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
        className={`flex items-center gap-1.5 h-8 px-3 text-xs font-medium focus:outline-none transition-all duration-150 select-none text-luxury-ink  ${showAllCategories ? "bg-primary/15" : "bg-primary/8 hover:bg-primary/15"}`}
      >
        <IconAlignLeft className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />
        <span className="inline">Danh mục</span>
        <IconChevronDown
          className={`w-3 h-3 shrink-0 transition-transform duration-200 ${showAllCategories ? "rotate-180" : ""}`}
          strokeWidth={2.5}
        />
      </button>

      {showAllCategories && (
        <div className="bg-cream-100 absolute left-0 top-full  z-50 w-[min(1180px,calc(100vw-2rem))]">
          <div
            className="rounded-[2px] shadow-[0_20px_56px_rgba(26,23,20,0.13),0_4px_16px_rgba(26,23,20,0.06)]"
          >
            <div className="py-8 ps-8">
              <p className="text-xs font-medium tracking-[0.15em] uppercase mb-1.5 text-charcoal-300">
                Danh mục hiện có
              </p>
              <h2 className="font-droid-serif text-xl font-medium mb-7 text-luxury-ink">
                Tìm đúng thứ <span className="text-accent">bạn đang cần.</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4 max-h-[min(90vh,580px)] overflow-y-auto   pr-1">
                {categories.map((category: ICategory, index: number) => (
                  <div key={category._id} className="group min-w-0  ">
                    <Link
                      href={`/categories/${category.slug}`}
                      className="flex items-center gap-2.5 mb-2 py-1"
                      onClick={onHideAllCategories}
                    >
                      <span className="text-2xs font-medium tabular-nums shrink-0 text-primary">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className=" font-droid-serif text-sm font-bold truncate transition-colors text-luxury-ink group-hover:text-primary">
                        {category.name}
                      </span>
                    </Link>
                    <div className="bg-luxury-ink/10 h-px" />
                    {category.subCategories?.length > 0 && (
                      <div className="space-y-0.3">
                        {category.subCategories.map((sub: ISubCategory) => (
                          <Link
                            key={sub._id}
                            href={`/categories/${category.slug}/sub/${sub.slug}`}
                            onClick={onHideAllCategories}
                            className="flex items-center gap-2 py-1.5 px-2 text-sm font-medium rounded-[2px] transition-colors truncate text-neutral-500 hover:bg-primary/10 hover:text-luxury-ink"
                          >
                            <span className="w-1 h-1 shrink-0 bg-primary/50" />
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
