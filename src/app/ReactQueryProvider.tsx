"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

const client = new QueryClient({defaultOptions: {
  queries: {
    staleTime: 1000 * 60
  }
}});

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
