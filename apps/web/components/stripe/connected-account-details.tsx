/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { retrieveStripeConnectAction } from "@/api/stripe/stripe-action"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardDescription,
  CardHeader,
} from "@workspace/ui/components/card"
import { format } from "date-fns"

export const ConnectedAccountDetails = () => {
  const { data } = useQuery({
    queryKey: ["retrieve-stripe-connect"],
    queryFn: retrieveStripeConnectAction,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
  return (
    <Card>
      <CardHeader>
        <div className="border-b border-gray-100 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Stripe Account</h2>
              <p className="mt-1 text-sm text-gray-500">
                Your Stripe account is connected and ready to receive payments.
              </p>
            </div>

            {data?.payouts_enabled ? (
              <Badge variant={"primary"} size={"lg"}>
                <span className="relative flex size-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
                </span>
                Connected
              </Badge>
            ) : (
              <Badge variant={"destructive"} size={"lg"}>
                <span className="mr-2 h-2 w-2 rounded-full bg-red-500"></span>{" "}
                Not Connected
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardDescription>
        <div className="mx-auto max-w-7xl px-6 py-10">
          {/* <!-- Top Cards --> */}

          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-900">
              <p className="text-slate-500">Account ID</p>
              <h2 className="mt-3 text-lg font-bold break-all dark:text-white">
                {data?.id}
              </h2>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-900">
              <p className="text-slate-500">Business Type</p>
              <h2 className="mt-3 text-3xl font-bold dark:text-white">
                {data?.business_type}
              </h2>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-900">
              <p className="text-slate-500">Country</p>
              <h2 className="mt-3 text-3xl font-bold dark:text-white">
                {data?.country}
              </h2>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-900">
              <p className="text-slate-500">Currency</p>
              <h2 className="mt-3 text-3xl font-bold uppercase dark:text-white">
                {data?.default_currency}
              </h2>
            </div>
          </div>

          {/* <!-- Main --> */}

          <div className="grid gap-8 lg:grid-cols-3">
            {/* <!-- Left --> */}

            <div className="space-y-8 lg:col-span-2">
              {/* <!-- Account --> */}

              <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-900">
                <div className="border-b px-6 py-5 dark:border-slate-700">
                  <h2 className="text-xl font-bold dark:text-white">
                    Account Information
                  </h2>
                </div>

                <div className="grid gap-6 p-6 md:grid-cols-2">
                  <div>
                    <p className="text-slate-500">Email</p>
                    <p className="font-semibold dark:text-white">
                      {data?.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Website</p>
                    <p className="font-semibold dark:text-white">
                      {data?.business_profile.url}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Charges Enabled</p>

                    {data?.charges_enabled ? (
                      <Badge variant={"primary"}>✓ Enabled</Badge>
                    ) : (
                      <Badge variant={"destructive"}>× Disabled</Badge>
                    )}
                  </div>

                  <div>
                    <p className="text-slate-500">Payouts</p>

                    {data?.payouts_enabled ? (
                      <Badge variant={"primary"}>✓ Enabled</Badge>
                    ) : (
                      <Badge variant={"destructive"}>× Disabled</Badge>
                    )}
                  </div>

                  <div>
                    <p className="text-slate-500">Dashboard</p>

                    <p className="font-semibold capitalize dark:text-white">
                      {data?.type}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Timezone</p>

                    <p className="font-semibold dark:text-white">
                      {data?.settings?.dashboard?.timezone}
                    </p>
                  </div>
                </div>
              </div>

              {/* <!-- Representative --> */}

              <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-900">
                <div className="border-b px-6 py-5 dark:border-slate-700">
                  <h2 className="text-xl font-bold dark:text-white">
                    Representative
                  </h2>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                      {data?.individual?.first_name[0].toUpperCase()}
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold dark:text-white">
                        {data?.individual?.first_name} {""}
                        {data?.individual?.last_name}
                      </h3>

                      <p className="text-slate-500">Representative</p>

                      <p className="mt-2 dark:text-slate-300">{data?.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- Bank --> */}

              <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-900">
                <div className="border-b px-6 py-5 dark:border-slate-700">
                  <h2 className="text-xl font-bold dark:text-white">
                    Bank Account
                  </h2>
                </div>

                <div className="overflow-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                      <tr className="text-left">
                        <th className="p-4">Bank</th>
                        <th className="p-4">Last 4</th>
                        <th className="p-4">Currency</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {data?.external_accounts?.data.map((item: any) => (
                        <tr
                          className="border-t dark:border-slate-700"
                          key={item.id}
                        >
                          <td className="p-4 dark:text-white">
                            {item.bank_name}
                          </td>

                          <td className="p-4 dark:text-white">
                            ****{item.last4}
                          </td>

                          <td className="p-4 uppercase dark:text-white">
                            {item.currency}
                          </td>

                          <td className="p-4">
                            {item.status === "verified" ? (
                              <Badge variant={"primary"} className="capitalize">
                                ✓ {item.status}
                              </Badge>
                            ) : (
                              <Badge variant={"destructive"}>
                                × Unverified
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* <!-- Right --> */}

            <div className="space-y-8">
              {/* <!-- Capabilities --> */}

              <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-900">
                <h2 className="mb-5 text-xl font-bold dark:text-white">
                  Capabilities
                </h2>

                <div className="flex items-center justify-between">
                  <span className="dark:text-slate-300">Transfers</span>

                  {data?.capabilities?.transfers === "active" ? (
                    <Badge variant={"primary"} className="capitalize">
                      ✓ {data?.capabilities?.transfers}
                    </Badge>
                  ) : (
                    <Badge variant={"destructive"}>× Inactive</Badge>
                  )}
                </div>
              </div>

              {/* <!-- Stats --> */}

              <div className="rounded-2xl bg-linear-to-br from-primary to-indigo-700 p-6 text-white shadow-xl">
                <h2 className="mb-6 text-xl font-bold">Account Status</h2>

                <div className="space-y-5">
                  <div className="flex justify-between">
                    <span>Charges</span>
                    <span>{data?.charges_enabled ? "✅" : "❌"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Payouts</span>
                    <span>{data?.payouts_enabled ? "✅" : "❌"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Details Submitted</span>
                    <span>{data?.details_submitted ? "✅" : "❌"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Created At</span>
                    {data?.individual?.created && (
                      <span>
                        {format(
                          new Date(data?.individual?.created * 1000),
                          "yyyy-MM-dd HH:mm:ss 'UTC'"
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardDescription>
    </Card>
  )
}
