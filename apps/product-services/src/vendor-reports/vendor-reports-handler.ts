import { RouteHandler } from "@workspace/open-api"
import {
  updateVendorSingleOrderRoute,
  vendorAllOrdersRoute,
  vendorCountryBasedRoute,
  vendorPreviousYearsReportRoute,
  vendorSingleOrderRoute,
  vendorTotalRevenueRoute,
} from "./vendor-reports-route"
import { and, count, countDistinct, db, eq, gte, sql, sum } from "@workspace/db"
import { orderItems, orders } from "@workspace/db/schema/order.schema"
import { products } from "@workspace/db/schema/products.schema"

export const vendorTotalRevenueHandler: RouteHandler<
  typeof vendorTotalRevenueRoute
> = async (c) => {
  try {
    const email = c.get("user")?.email
    const [[result], [order], [orderItem], [uniqueUser]] = await Promise.all([
      // start: Total Revenue
      db
        .select({
          count: sql<number>`
            COALESCE(
              SUM(${orderItems.price} * ${orderItems.quantity}),
              0
            )
          `,
          currentTotal: sql<number>`
          COALESCE(
            SUM(
              CASE
                WHEN ${orders.createdAt} >= date_trunc('month', CURRENT_DATE)
                THEN ${orderItems.quantity}*${orderItems.price}
                ELSE 0
              END
            ),
            0
          )
        `,
          previousTotal: sql<number>`
          COALESCE(
            SUM(
              CASE 
                WHEN ${orders.createdAt} >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month' 
                AND ${orders.createdAt} < date_trunc('month', CURRENT_DATE) 
                THEN ${orderItems.quantity}*${orderItems.price} 
                ELSE 0 
              END
            ), 
            0
          )
        `,
        })
        .from(orders)
        .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(
          and(
            eq(orders.isPaid, true),
            eq(products.userEmail, email!),
            gte(
              orders.createdAt,
              sql`date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'`
            )
          )
        ),
      // end: Total Revenue
      // start: Total Order
      db
        .select({
          count: countDistinct(orders.id),
          currentTotal: sql<number>`
            COALESCE(COUNT(
              DISTINCT CASE
                WHEN ${orders.createdAt} >= date_trunc('month', CURRENT_DATE)
                THEN ${orders.id}
              END
            ),0)
          `,
          previousTotal: sql<number>`
            COALESCE(COUNT(
              DISTINCT CASE
                WHEN ${orders.createdAt} >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
                AND ${orders.createdAt} < date_trunc('month', CURRENT_DATE)
                THEN ${orders.id}
              END
            ),0)
          `,
        })
        .from(orders)
        .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(
          and(
            eq(orders.isPaid, true),
            eq(products.userEmail, email!),
            gte(
              orders.createdAt,
              sql`date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'`
            )
          )
        ),
      // end: Total Order
      // start: OrderItem
      db
        .select({
          totalOrder: sum(orderItems.quantity),
          currentTotal: sql<number>`
            COALESCE(SUM(
              CASE
                WHEN ${orderItems.createdAt} >= date_trunc('month', CURRENT_DATE)
                THEN ${orderItems.quantity}
              END
            ),0)
          `,
          previousTotal: sql<number>`
            COALESCE(SUM(
              CASE
                WHEN ${orderItems.createdAt} >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
                AND ${orderItems.createdAt} < date_trunc('month', CURRENT_DATE)
                THEN ${orderItems.quantity}
              END
            ),0)
          `,
        })
        .from(orderItems)
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(eq(products.userEmail, email!)),
      // end: OrderItem
      // start: unique user
      db
        .select({
          count: countDistinct(orders.email),
          currentTotal: sql<number>`
            COALESCE(COUNT(
              DISTINCT CASE
                WHEN ${orders.createdAt} >= date_trunc('month', CURRENT_DATE)
                THEN ${orders.email}
              END
            ),0)
          `,
          previousTotal: sql<number>`
            COALESCE(COUNT(
              DISTINCT CASE
                WHEN ${orders.createdAt} >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
                AND ${orders.createdAt} < date_trunc('month', CURRENT_DATE)
                THEN ${orders.email}
              END
            ),0)
          `,
        })
        .from(orders)
        .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(
          and(
            eq(orders.isPaid, true),
            eq(products.userEmail, email!),
            gte(
              orders.createdAt,
              sql`date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'`
            )
          )
        ),
      // end: unique user
    ])

    // start: Total Revenue calculate
    const currentTotal = Number(result?.currentTotal ?? 0)
    const previousTotal = Number(result?.previousTotal ?? 0)

    const percentageChange =
      previousTotal === 0
        ? currentTotal > 0
          ? 100
          : 0
        : ((currentTotal - previousTotal) / previousTotal) * 100
    // end: Total Revenue
    const currentTotalOrder = Number(order?.currentTotal ?? 0)
    const previousTotalOrder = Number(order?.previousTotal ?? 0)
    const currentOrderItem = Number(orderItem?.currentTotal)
    const previousOrderItem = Number(orderItem?.previousTotal)
    const currentDistinctUser = Number(uniqueUser?.currentTotal)
    const previousDistinctUser = Number(uniqueUser?.previousTotal)

    const orderPercentageChange =
      previousTotalOrder === 0
        ? currentTotalOrder > 0
          ? 100
          : 0
        : ((currentTotalOrder - previousTotalOrder) / previousTotalOrder) * 100

    const orderItemPercentage =
      previousOrderItem === 0
        ? currentOrderItem > 0
          ? 100
          : 0
        : ((currentOrderItem - previousOrderItem) / previousOrderItem) * 100

    const uniqueUserPercentage =
      previousDistinctUser === 0
        ? currentDistinctUser > 0
          ? 100
          : 0
        : ((currentDistinctUser - previousDistinctUser) /
            previousDistinctUser) *
          100

    return c.json({
      revenue: {
        total: Number(result?.count ?? 0),
        current: currentTotal,
        previous: previousTotal,
        percentage: Number(percentageChange.toFixed(2)),
      },
      order: {
        total: Number(order?.count ?? 0),
        current: currentTotalOrder,
        previous: previousTotalOrder,
        percentage: Number(orderPercentageChange.toFixed(2)),
      },
      orderItem: {
        total: Number(orderItem?.totalOrder),
        current: currentOrderItem,
        previous: previousOrderItem,
        percentage: Number(orderItemPercentage.toFixed(2)),
      },
      uniqueUser: {
        total: Number(uniqueUser?.count ?? 0),
        current: currentDistinctUser,
        previous: previousDistinctUser,
        percentage: Number(uniqueUserPercentage.toFixed(2)),
      },
    })
  } catch (error) {
    return c.json({ message: "Something went wrong" }, 500)
  }
}

export const vendorAllOrdersHandler: RouteHandler<
  typeof vendorAllOrdersRoute
> = async (c) => {
  try {
    const email = c.get("user")?.email
    const { limit, page } = c.req.valid("query")
    const offset = (page - 1) * limit
    const [data, totalResult] = await Promise.all([
      db
        .select({
          orderItems: orderItems,
          orders: orders,
          products: { title: products.title, images: products.images },
        })
        .from(orderItems)
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(eq(products.userEmail, email!))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(orderItems)
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(eq(products.userEmail, email!)),
    ])

    const total = totalResult[0]?.count ?? 0
    const totalPages = Math.ceil(total / limit)

    return c.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    return c.json({ message: "Something went wrong" }, 500)
  }
}

export const vendorSingleOrderHandler: RouteHandler<
  typeof vendorSingleOrderRoute
> = async (c) => {
  try {
    const { id } = c.req.valid("param")
    const email = c.get("user")?.email
    const [data] = await db
      .select({
        orderItems,
        orders,
        products: { title: products.title, images: products.images },
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(and(eq(orderItems.id, id), eq(products.userEmail, email!)))

    return c.json({ data }, 200)
  } catch (error) {
    return c.json({ message: "Something went wrong" }, 500)
  }
}

export const updateVendorSingleOrderHandler: RouteHandler<
  typeof updateVendorSingleOrderRoute
> = async (c) => {
  try {
    const { id, status } = c.req.valid("json")
    const email = c.get("user")?.email
    const [orderItem] = await db
      .select({
        id: orderItems.id,
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(and(eq(orderItems.id, id), eq(products.userEmail, email!)))
      .limit(1)

    if (!orderItem) {
      return c.json({ message: "You're not author of this product" }, 404)
    }

    const [data] = await db
      .update(orderItems)
      .set({ status })
      .where(eq(orderItems.id, id))
      .returning()

    return c.json({ data }, 200)
  } catch (error) {
    return c.json({ message: "Something went wrong" }, 500)
  }
}

export const vendorCountryBasedHandler: RouteHandler<
  typeof vendorCountryBasedRoute
> = async (c) => {
  try {
    const email = c.get("user")?.email

    const data = await db
      .select({
        country: orders.country,
        quantity: sql<number>`
          COALESCE(
            SUM(
              ${orderItems.quantity}
            ),
            0
          )::int
        `,
        price: sql<number>`
          COALESCE(
            SUM(${orderItems.price} * ${orderItems.quantity}),
            0
          )
        `,
      })
      .from(orders)
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(products.id, orderItems.productId))
      .where(eq(products.userEmail, email!))
      .groupBy(orders.country)

    return c.json({ data }, 200)
  } catch (error) {
    return c.json({ message: "Something went wrong" }, 500)
  }
}

export const vendorPreviousYearsReportHandler: RouteHandler<
  typeof vendorPreviousYearsReportRoute
> = async (c) => {
  try {
    const email = c.get("user")?.email as string

    const { endMonth, startMonth } = c.req.valid("query")
    const data = await db.execute(sql`
      WITH params AS (
        SELECT
          COALESCE(
            ${startMonth ? sql`${startMonth}::date` : sql`date_trunc('month', CURRENT_DATE) - INTERVAL '11 months'`}
          ) AS start_month,
          COALESCE(
            ${endMonth ? sql`${endMonth}::date` : sql`date_trunc('month', CURRENT_DATE)`}
          ) AS end_month
      ),
      months AS (
        SELECT generate_series(
          date_trunc('month', start_month),
          date_trunc('month', end_month),
          INTERVAL '1 month'
        ) AS month
        FROM params
      ),
      sales AS (
        SELECT
          date_trunc('month', o.created_at) AS month,
          SUM(oi.quantity)::int AS quantity,
          SUM(oi.price * oi.quantity)::float AS "totalSale"
        FROM ${orderItems} oi
        INNER JOIN ${orders} o
          ON o.id = oi.order_id
        INNER JOIN ${products} p
          ON p.id = oi.product_id
        CROSS JOIN params
        WHERE p.user_email = ${email}
          AND o.is_paid = true
          AND oi.status != 'CANCELLED'
          AND o.created_at >= date_trunc('month', params.start_month)
          AND o.created_at < date_trunc('month', params.end_month) + INTERVAL '1 month'
        GROUP BY date_trunc('month', o.created_at)
      )
      SELECT
        m.month::date AS month,
        COALESCE(s.quantity, 0)::int AS quantity,
        COALESCE(s."totalSale", 0)::float AS "totalSale"
      FROM months m
      LEFT JOIN sales s
        ON s.month = m.month
      ORDER BY m.month ASC
    `)

    return c.json({ data: data.rows }, 200)
  } catch (error) {
    return c.json({ message: "Something went wrong" }, 500)
  }
}
