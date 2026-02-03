import { useQuery } from "@tanstack/react-query";
import { AdminService } from "@/services/admin.service";

export function useAdminModeration() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "moderation", "stats"],
    queryFn: () => AdminService.getModerationStats(),
  });

  const raw = data?.data;
  const statusStats = raw?.statusStats ?? [];
  const aiStats = raw?.aiStats ?? [];
  const needsReview = raw?.needsReview ?? 0;

  return { statusStats, aiStats, needsReview, isLoading, error };
}

