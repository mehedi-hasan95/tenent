import { BoostedProductsSlider } from "./_components/boosted-products-slider"
import { ShopByCategory } from "./_components/shop-by-category"
import { FeaturedProducts } from "./_components/featured-products"
import { BrowsedProducts } from "./_components/browsed-products"
import { PopularProducts } from "./_components/popular-products"

export default function Page() {
  return (
    <div className="relative flex min-h-svh flex-col space-y-5">
      <BoostedProductsSlider />
      <ShopByCategory />
      <FeaturedProducts />
      <PopularProducts />
      <BrowsedProducts />
    </div>
  )
}
