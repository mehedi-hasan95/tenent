"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "./theme-provider"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { RegistrationModal } from "./auth-components/registration-modal"
import { SignInModal } from "./auth-components/signin-modal"
import { Toaster } from "sonner"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

export const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const queryClient = new QueryClient()
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {children}
          <RegistrationModal />
          <SignInModal />
          <Toaster richColors />
          <ReactQueryDevtools initialIsOpen={false} />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
