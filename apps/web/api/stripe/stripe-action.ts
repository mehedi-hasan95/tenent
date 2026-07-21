export const stripeConnectAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PAYMENT_URL}/stripe/connect`,
    {
      method: "POST",
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
  return response.json()
}

export const createCoinPaymentIntent = async (coin: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PAYMENT_URL}/boosting/buy-coin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ coin }),
      credentials: "include",
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  // return response.json()
  const data = await response.json()
  return data.data as string
}

export const retrieveStripeConnectAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PAYMENT_URL}/stripe/retrieve-stripe-connect`,
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
  const data = await response.json()
  return data.data
}
