export const authFetch = async ({
  type,
  otp,
  email,
}: {
  type: "verification" | "reset"
  otp: string
  email: string
}) => {
  const response = await fetch(
    "http://localhost:4001/api/v1/auth/get-send-email",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, otp, email }),
    }
  )

  return response.json()
}
