import { ProductIdPage } from "./_components/product-id-page"

interface Props {
  params: Promise<{ id: string }>
}
const Page = async ({ params }: Props) => {
  const { id } = await params
  return <ProductIdPage id={id} />
}

export default Page
