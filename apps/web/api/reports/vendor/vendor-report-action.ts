import { VENDER_REPORT_TYPE } from "@workspace/validators/types/orders.types"

export const vendorReportsAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/vendor/reports/total-revenue`,
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
  const data: {
    revenue: VENDER_REPORT_TYPE
    order: VENDER_REPORT_TYPE
    orderItem: VENDER_REPORT_TYPE
    uniqueUser: VENDER_REPORT_TYPE
  } = await response.json()
  return data
}
