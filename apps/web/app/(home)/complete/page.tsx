import { OrderSuccessPage } from "./_components/order-success-page"

interface Props {
  searchParams: Promise<{ session_id: string }>
}
const Page = async ({ searchParams }: Props) => {
  const { session_id } = await searchParams
  if (!session_id) {
    return <div>No session id found!</div>
  }
  return (
    <div className="px-6">
      <OrderSuccessPage id={session_id} />
    </div>
  )
}

export default Page
