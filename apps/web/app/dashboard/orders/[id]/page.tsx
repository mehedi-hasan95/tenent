import { SingleOrderPage } from "./_components/single-order-page"

interface Props {
  params: Promise<{ id: string }>
}
const Page = async ({ params }: Props) => {
  const { id } = await params
  return <SingleOrderPage id={id} />
}

export default Page
