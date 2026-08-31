"use client"
import { useAddToCartStore } from "@/store/products/use-add-to-cart-store"
import { Button } from "@workspace/ui/components/button"
import { CartItem } from "./cart-item"
import { Separator } from "@workspace/ui/components/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { formatPrice } from "@/lib/lib"
import { LoginButton } from "@/components/auth/login-button"
import { useGetSession } from "@/hooks/auth/use-auth"
import { useCheckoutStore } from "@/store/products/use-checkout-store"
import { MoveLeft } from "lucide-react"
import { useEffect } from "react"
import { ProductCheckout } from "./checkout/product-checkout"
import { useShallow } from "zustand/react/shallow"
import { useQuery } from "@tanstack/react-query"
import { getArrayProductsAction } from "@/api/products/products-action"

export const AddToCartPage = () => {
  const { products, removeItem, updateQuantity, clear } = useAddToCartStore(
    useShallow((state) => ({
      products: state.products,
      removeItem: state.removeItem,
      updateQuantity: state.updateQuantity,
      clear: state.clear,
    }))
  )
  const removeCart = (id: string) => {
    removeItem(id)
  }
  const updateQuantityState = (id: string, quantity: number) => {
    updateQuantity(id, quantity)
  }
  const { user } = useGetSession()

  const { step, setStep, reset } = useCheckoutStore()
  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])
  const productIds = products.map((item) => item.id)
  const { data } = useQuery({
    queryKey: ["add-to-cart-data", productIds],
    queryFn: () => getArrayProductsAction({ ids: productIds }),
    enabled: !!productIds,
    staleTime: 1000 * 5 * 60,
  })

  const productsLocalStorage = new Map(
    products.map((item) => [
      item.id,
      {
        color: item.color,
        quantity: item.quantity,
        size: item.size,
        usedCoupon: item.usedCoupon,
      },
    ])
  )
  const result = data?.map((item) => {
    const localData = productsLocalStorage.get(item.products.id)
    const usedCoupon =
      localData?.usedCoupon && item.coupons?.code === localData.usedCoupon
        ? true
        : false
    const validCoupon =
      item.coupons &&
      item.coupons.isActive &&
      item.coupons.code === localData?.usedCoupon &&
      (!item.coupons.expiresAt || new Date(item.coupons.expiresAt) > new Date())
        ? true
        : false

    const quantity = localData?.quantity ?? 1
    const baseTotal = item.products.salePrice * quantity

    let finalItemTotal = baseTotal
    if (usedCoupon && validCoupon) {
      if (
        item.coupons?.discountPercent !== null &&
        item.coupons?.discountPercent !== undefined
      ) {
        finalItemTotal =
          baseTotal - baseTotal * (item.coupons.discountPercent / 100)
      } else if (
        item.coupons?.flatDiscount !== null &&
        item.coupons?.flatDiscount !== undefined
      ) {
        finalItemTotal = Math.max(0, baseTotal - item.coupons.flatDiscount)
      }
    }

    return {
      ...item,
      ...localData,
      quantity,
      finalItemTotal,
      usedCoupon,
      validCoupon,
    }
  })

  return (
    <section className="mx-auto max-w-7xl p-6">
      <div className="mb-8 flex items-center justify-between">
        {step === "list" ? (
          <>
            <h1 className="text-3xl font-extrabold">Your Shopping Cart</h1>
            <Button
              variant={"ghost"}
              className="text-sm font-medium text-red-500 transition-colors hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
              onClick={() => clear()}
            >
              Remove All Items
            </Button>
          </>
        ) : (
          <Button
            variant={"ghost"}
            className="text-blue-300"
            onClick={() => setStep("list")}
          >
            <MoveLeft /> Back to Checkout
          </Button>
        )}
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-full space-y-3 md:col-span-2">
          {step === "list" ? (
            result?.map((item) => (
              <CartItem
                key={item.products.id}
                image={item.products.images[0] as string}
                price={item.products.salePrice}
                quantity={item.quantity}
                title={item.products.title}
                removeCart={() => removeCart(item.products.id)}
                onUpdateQuantity={(newQuantity) =>
                  updateQuantityState(item.products.id, newQuantity)
                }
                size={item.size}
                usedCoupon={item.usedCoupon}
                validCoupon={item.validCoupon}
                couponPercentage={item.coupons?.discountPercent || null}
                flatRate={item.coupons?.flatDiscount || null}
              />
            ))
          ) : (
            <ProductCheckout />
          )}
        </div>
        <div className="col-span-full rounded-2xl bg-card p-6 md:col-span-1">
          <h2 className="text-lg font-bold md:text-xl lg:text-2xl">
            Your Cart
          </h2>
          <Separator className="my-2" />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={3}>Name</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result?.map((item) => (
                <TableRow key={item.products.id}>
                  <TableCell colSpan={3}>
                    {item.products.title.length > 40
                      ? item.products.title.slice(0, 40) + "..."
                      : item.products.title}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(item.finalItemTotal)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">
                  {formatPrice(
                    (result ?? []).reduce(
                      (total, product) => total + product.finalItemTotal,
                      0
                    )
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          {step === "list" && (
            <div className="mt-5">
              {user ? (
                <Button
                  className="mt-5 w-full"
                  variant={"primary"}
                  onClick={() => setStep("cart")}
                  disabled={!products.length}
                >
                  Checkout
                </Button>
              ) : (
                <LoginButton title="Checkout" />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
