import { QueryClient } from "@tanstack/react-query"

export default function getQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  })
}
