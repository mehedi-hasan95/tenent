"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "./theme-provider"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { SignupModal } from "./auth-components/signup-modal"
import { SignInModal } from "./auth-components/signin-modal"
import { Toaster } from "sonner"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"
import getQueryClient from "@/lib/lib"

export const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const [queryClient] = useState(() => getQueryClient())
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {children}
          <SignupModal />
          <SignInModal />
          <Toaster richColors />
          <ReactQueryDevtools initialIsOpen={false} />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
