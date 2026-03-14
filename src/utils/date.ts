export function getMonthYear(dateString?: string): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return `${date.getMonth() + 1}/${date.getFullYear()}`;
}