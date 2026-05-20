import { QueryClient } from "@tanstack/react-query"

export default function getQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  })
}

export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}
