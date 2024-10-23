import { useQueryClient } from "@tanstack/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchGithubRepos } from "@/lib/github";

// Constants for configuration
const GITHUB_CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const GITHUB_STALE_TIME = 2 * 60 * 1000; // 2 minutes
const RETRY_DELAY = 1000; // 1 second base delay
const MAX_RETRIES = 3;

export const useGithubRepos = (options = {}) => {
  const queryClient = useQueryClient();

  // Main query for fetching repositories
  const query = useQuery({
    queryKey: ["github-repos"],
    queryFn: fetchGithubRepos,

    // Caching configuration
    gcTime: GITHUB_CACHE_TIME,
    staleTime: GITHUB_STALE_TIME,

    // Rate limiting and error handling
    retry: (failureCount, error) => {
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      // Only retry up to MAX_RETRIES times
      return failureCount < MAX_RETRIES;
    },
    retryDelay: (attemptIndex) => {
      // Exponential backoff with jitter
      const delay = Math.min(
        RETRY_DELAY * Math.pow(2, attemptIndex) + Math.random() * 1000,
        30000, // Maximum 30 second delay
      );
      return delay;
    },

    // Optimistic updateS
    placeholderData: (previousData) => previousData,

    // Prefetch on hover/focus
    refetchOnMount: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    ...options,
  });

  // force refersh
  const refreshMutation = useMutation({
    mutationFn: fetchGithubRepos,
    onSuccess: (newData) => {
      queryClient.setQueryData(["github-repos"], newData);
    },
  });

  // Prefetch function
  const prefetchRepositories = async () => {
    await queryClient.prefetchQuery({
      queryKey: ["github-repos"],
      queryFn: fetchGithubRepos,
      staleTime: GITHUB_STALE_TIME,
    });
  };

  // Background refetch function with rate limit awareness
  const backgroundRefetch = async () => {
    try {
      // Check limited
      const rateLimitReset = localStorage.getItem("github-rate-limit-reset");
      if (rateLimitReset) {
        const resetTime = parseInt(rateLimitReset);
        if (resetTime > Date.now()) {
          return;
        }
      }

      await query.refetch();
    } catch (error) {
      if (error?.status === 403) {
        // Store rate limit reset time
        const resetTime = error.headers?.get("x-ratelimit-reset");
        if (resetTime) {
          localStorage.setItem(
            "github-rate-limit-reset",
            (parseInt(resetTime) * 1000).toString(),
          );
        }
      }
    }
  };

  // Handle rate limit headers
  const handleRateLimits = (headers) => {
    const remaining = headers?.get("x-ratelimit-remaining");
    const reset = headers?.get("x-ratelimit-reset");

    if (remaining && reset) {
      localStorage.setItem("github-rate-limit-remaining", remaining);
      localStorage.setItem(
        "github-rate-limit-reset",
        (parseInt(reset) * 1000).toString(),
      );
    }
  };

  return {
    ...query,
    refreshMutation,
    prefetchRepositories,
    backgroundRefetch,
    forceRefresh: refreshMutation.mutate,
    isRefreshing: refreshMutation.isPending,
    getRateLimitInfo: () => ({
      remaining: localStorage.getItem("github-rate-limit-remaining"),
      resetTime: localStorage.getItem("github-rate-limit-reset"),
    }),
  };
};
