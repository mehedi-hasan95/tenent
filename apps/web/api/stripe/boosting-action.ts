import { BOOSTING_COIN_TYPE } from "@workspace/validators/types/boosting.types"

export const getActiveBoostingCoinAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/boosting/active-boosting-coin`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  const data: { data: BOOSTING_COIN_TYPE | undefined } = await response.json()
  return data.data
}
