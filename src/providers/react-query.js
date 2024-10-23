"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export const ReactQueryClientProvider = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchInterval: 60 * 1000,
            retry: 2, // Retry failed requests twice
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
            gcTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: process.env.NODE_ENV === "production", // Only in production
            refetchOnReconnect: "always",
          },
          mutations: {
            retry: 1, // Retry failed mutations once
            retryDelay: 1000,
          },
        },
        // Add built-in error logger
        logger: {
          log: console.log,
          warn: console.warn,
          error:
            process.env.NODE_ENV === "development" ? console.error : () => {},
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
    </QueryClientProvider>
  );
};
