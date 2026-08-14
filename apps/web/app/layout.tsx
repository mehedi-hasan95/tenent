import { DynaPuff, Geist, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { cn } from "@workspace/ui/lib/utils"
import { Providers } from "@/components/providers/providers"
import { getSessionAction } from "@/api/auth/auth-server-action"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { retrieveStripeConnectAction } from "@/api/stripe/stripe-action"
import { boostedProductsAction } from "@/api/products/products-action"
import { getQueryClient } from "@/lib/get-query-client"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const dynaPuff = DynaPuff({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dynaPuff",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["session"],
    queryFn: getSessionAction,
  })
  await queryClient.prefetchQuery({
    queryKey: ["retrieve-stripe-connect"],
    queryFn: retrieveStripeConnectAction,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
  await queryClient.prefetchQuery({
    queryKey: ["boosted-products"],
    queryFn: boostedProductsAction,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable,
        "dynaPuff",
        dynaPuff.variable
      )}
    >
      <body>
        <Providers>
          <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  )
}
