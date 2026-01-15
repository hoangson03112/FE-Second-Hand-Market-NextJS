import { AccountInfo } from "@/types/auth";
import { ICategory } from "@/types/category";


export type HeaderViewProps = {
  account?: AccountInfo | null;
  visibleCategories: ICategory[];
  categories: ICategory[];
  isLoading: boolean;
  activeCategory: string | null;
  showAllCategories: boolean;
  onMouseEnterCategory: (id: string) => void;
  onMouseLeaveCategory: () => void;
  onShowAll: () => void;
  onHideAll: () => void;
  onSearch: (q?: string) => void;
};

export default HeaderViewProps;
