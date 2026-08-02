"use client"
import { useAddToCartStore } from "@/store/products/use-add-to-cart"
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

export const AddToCartPage = () => {
  const { products, removeItem, updateQuantity, clear } = useAddToCartStore()
  const removeCart = (id: string) => {
    removeItem({ id })
  }
  const updateQuantityState = (id: string, quantity: number) => {
    updateQuantity({ id, quantity })
  }
  return (
    <section className="mx-auto max-w-7xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Your Shopping Cart</h1>
        <Button
          variant={"ghost"}
          className="text-sm font-medium text-red-500 transition-colors hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
          onClick={() => clear()}
        >
          Remove All Items
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-full space-y-3 md:col-span-2">
          {products.map((item) => (
            <CartItem
              key={item.id}
              image={item.image}
              price={item.price}
              quantity={item.quantity}
              title={item.title}
              removeCart={() => removeCart(item.id)}
              onUpdateQuantity={(newQuantity) =>
                updateQuantityState(item.id, newQuantity)
              }
            />
          ))}
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
              {products.map((item) => (
                <TableRow key={item.id}>
                  <TableCell colSpan={3}>
                    {item.title.length > 40
                      ? item.title.slice(0, 40) + "..."
                      : item.title}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(item.price * item.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">
                  {formatPrice(
                    products.reduce(
                      (total, product) =>
                        total + product.price * product.quantity,
                      0
                    )
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          <Button className="mt-5 w-full" variant={"primary"}>
            Checkout
          </Button>
        </div>
      </div>
    </section>
  )
}
