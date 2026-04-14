"use client";

// import { SnackbarProvider } from "@/app/context/SnackbarContext";
import React from "react";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { Suspense } from "react";

function Providers({ children }: React.PropsWithChildren) {
  const queryClient = new QueryClient();

  return (
    <Suspense>
      <QueryClientProvider client={queryClient}>
        {/* <SnackbarProvider> */}
        {children}
        {/* </SnackbarProvider> */}
      </QueryClientProvider>
    </Suspense>
  );
}

export default Providers;