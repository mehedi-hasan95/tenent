import { BoostedProductsSlider } from "./_components/boosted-products-slider"
import { ShopByCategory } from "./_components/shop-by-category"
import { FeaturedProducts } from "./_components/featured-products"

export default function Page() {
  return (
    <div className="relative flex min-h-svh flex-col space-y-5">
      <BoostedProductsSlider />
      <ShopByCategory />
      <FeaturedProducts />
    </div>
  )
}
