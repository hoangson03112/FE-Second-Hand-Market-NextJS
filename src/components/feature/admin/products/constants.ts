export const CONDITION_LABEL: Record<string, string> = {
  new: "Mới",
  like_new: "Như mới",
  good: "Tốt",
  fair: "Khá",
  poor: "Cũ",
};

export const STATUS_BADGE: Record<
  string,
  { label: string; dot: string; chip: string }
> = {
  pending: {
    label: "Chờ duyệt",
    dot: "bg-yellow-400",
    chip: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  },
  under_review: {
    label: "Đang xem xét",
    dot: "bg-purple-400",
    chip: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  },
  approved: {
    label: "Đã duyệt",
    dot: "bg-green-400",
    chip: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  },
  rejected: {
    label: "Từ chối",
    dot: "bg-red-400",
    chip: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  },
  inactive: {
    label: "Ẩn",
    dot: "bg-gray-400",
    chip: "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300",
  },
  sold: {
    label: "Đã bán",
    dot: "bg-blue-400",
    chip: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  },
};
