import { Geist, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { cn } from "@workspace/ui/lib/utils"
import { Providers } from "@/components/providers"
import getQueryClient from "@/lib/lib"
import { getSessionAction } from "@/api/auth/auth-server-action"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
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
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
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
