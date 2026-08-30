import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 8_000,
            retry: (count, err) => {
              if (err instanceof Error && err.message === "Unauthorized") return false;
              return count < 1;
            },
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={client}>
      {children}
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          className: "font-sans",
          style: {
            background: "#121416",
            color: "#ece8e0",
            border: "1px solid color-mix(in oklab, #ece8e0 12%, transparent)",
          },
        }}
      />
    </QueryClientProvider>
  );
}
