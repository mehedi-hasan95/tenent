export const stripeConnectAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PAYMENT_URL}/stripe/connect`,
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
  return response.json()
}
