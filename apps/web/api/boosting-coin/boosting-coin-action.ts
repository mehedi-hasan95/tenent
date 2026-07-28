import { BOOSTING_COIN_TYPE } from "@workspace/validators/types/boosting.types"
export const createBoostingCoinAction = async (coin: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_URL}/boosting/create-boosting-coin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ coin }),
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  return response.json()
}

export const setActiveBoostingCoinAction = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_URL}/boosting/set-active-boosting-coin`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id }),
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  return response.json()
}

export const allBoostingCoinAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_URL}/boosting/all-boosting-coin`,
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
  const data: { data: BOOSTING_COIN_TYPE[] } = await response.json()
  return data.data
}
