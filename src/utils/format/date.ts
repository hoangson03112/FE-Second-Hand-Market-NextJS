export const formatMonthYear = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return `${date.getMonth() + 1}/${date.getFullYear()}`;
    } catch (error) {
      return "N/A";
    }
  };