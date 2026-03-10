export const formatMonthYear = (dateString: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getFullYear()}`;
  } catch {
    return "N/A";
  }
};

export const format = (dateString: string) => {
  if (!dateString) return "—";
  try {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
};

export const formatDateOnly = (dateString: string) => {
  if (!dateString) return "—";
  try {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

/**
 * Returns a human-readable relative time string in Vietnamese.
 * e.g. "Vừa xong", "5 phút trước", "2 giờ trước", "3 ngày trước",
 * or a full date for anything older than 30 days.
 */
export const formatTimeAgo = (dateString: string): string => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";

  const diff = Date.now() - date.getTime();
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;

  if (diff < minute) return "Vừa xong";
  if (diff < hour) return `${Math.floor(diff / minute)} phút trước`;
  if (diff < day) return `${Math.floor(diff / hour)} giờ trước`;
  if (diff < 7 * day) return `${Math.floor(diff / day)} ngày trước`;
  if (diff < month) return `${Math.floor(diff / (7 * day))} tuần trước`;

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};