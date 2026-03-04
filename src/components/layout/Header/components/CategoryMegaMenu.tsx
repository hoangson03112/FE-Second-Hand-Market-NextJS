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
      className="relative shrink-0 hidden md:block"
      onMouseEnter={onShowAllCategories}
      onMouseLeave={onHideAllCategories}
    >
      <button
        type="button"
        className="flex items-center gap-1.5 h-8 px-3 text-[12.5px] font-semibold focus:outline-none transition-all duration-150 select-none"
        style={{
          background: showAllCategories ? "#E2D4C2" : "#EDE0D4",
          color: "#4A3F33",
          borderRadius: "9999px",
        }}
        onMouseEnter={(event) => {
          if (!showAllCategories) event.currentTarget.style.background = "#E2D4C2";
        }}
        onMouseLeave={(event) => {
          if (!showAllCategories) event.currentTarget.style.background = "#EDE0D4";
        }}
      >
        <IconAlignLeft className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />
        <span className="hidden lg:inline">Danh mục</span>
        <IconChevronDown
          className={`w-3 h-3 shrink-0 transition-transform duration-200 ${showAllCategories ? "rotate-180" : ""}`}
          strokeWidth={2.5}
        />
      </button>

      {showAllCategories && (
        <div className="absolute left-0 top-full pt-2 z-50 w-[min(1180px,calc(100vw-2rem))]">
          <div
            style={{
              background: "#FDFAF6",
              border: "1px solid #E4D9CC",
              borderRadius: "16px",
              boxShadow: "0 20px 56px rgba(26,23,20,0.13), 0 4px 16px rgba(26,23,20,0.06)",
            }}
          >
            <div className="py-8 px-8 lg:px-10">
              <p
                className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-1.5"
                style={{ color: "#C47B5A" }}
              >
                Danh mục
              </p>
              <h2 className="text-xl font-semibold mb-7" style={{ color: "#1A1714" }}>
                Tìm đúng thứ <span style={{ color: "#C47B5A" }}>bạn đang cần.</span>
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
                        className="text-[10px] font-medium tabular-nums shrink-0"
                        style={{ color: "#C47B5A" }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="text-[13px] font-semibold truncate transition-colors group-hover:text-[#C47B5A]"
                        style={{ color: "#1A1714" }}
                      >
                        {category.name}
                      </span>
                    </Link>
                    <div style={{ height: "1px", background: "#EDE0D4", marginBottom: "6px" }} />
                    {category.subCategories?.length > 0 && (
                      <div className="space-y-0.5">
                        {category.subCategories.map((sub: ISubCategory) => (
                          <Link
                            key={sub._id}
                            href={`/categories/${category.slug}/sub/${sub.slug}`}
                            onClick={onHideAllCategories}
                            className="flex items-center gap-2 py-1.5 px-2 text-[12px] font-medium rounded-md transition-colors truncate"
                            style={{ color: "#7A6755" }}
                            onMouseEnter={(event) => {
                              event.currentTarget.style.background = "#F5EDE4";
                              event.currentTarget.style.color = "#C47B5A";
                            }}
                            onMouseLeave={(event) => {
                              event.currentTarget.style.background = "";
                              event.currentTarget.style.color = "#7A6755";
                            }}
                          >
                            <span className="w-1 h-1 rounded-full shrink-0" style={{ background: "#C4A882" }} />
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
