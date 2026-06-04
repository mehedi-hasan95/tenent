"use client"
import { useGetUser, useIsPasswordVerified } from "@/hooks/auth/use-auth"
import { useIsProfileEditableStore } from "@/store/useVerifyPasswordModalStore"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Calendar, CheckCircle, Mail, Pen, Phone, Shield } from "lucide-react"
import Image from "next/image"
import { VerifyPasswordForm } from "./verify-password-form"

export const UserProfilePreview = () => {
  const { data } = useIsPasswordVerified()
  const { setIsOpen } = useIsProfileEditableStore()
  const { data: user } = useGetUser()
  return (
    <div className="relative mx-auto w-full max-w-4xl space-y-4">
      <div className="w-full overflow-hidden rounded-2xl bg-white/90 shadow-lg">
        <div className="absolute top-3 right-3">
          {data ? (
            <Button onClick={() => setIsOpen(true)}>
              <Pen /> Edit Profile
            </Button>
          ) : (
            <VerifyPasswordForm
              trigger={
                <span className="flex items-center justify-center gap-3">
                  <Pen /> Edit Profile
                </span>
              }
            />
          )}
        </div>
        {/* Banner */}
        <div className="h-28 bg-linear-to-r from-blue-500 to-indigo-600" />

        <div className="px-6 pb-6">
          {/* Profile */}
          <div className="-mt-14 flex items-end gap-4">
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-slate-200">
              <Image
                src={user?.image ?? "https://github.com/shadcn.png"}
                alt={user?.name || "User"}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 pt-2">
              <h1 className="text-3xl font-bold text-slate-900">
                {user?.name || "No name provided"}
              </h1>
              {user?.username && (
                <p className="text-base text-slate-500">@{user?.username}</p>
              )}
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-sky-700" />
              <span className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-sky-700">
                {user?.role}
              </span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <span className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
                {user?.emailVerified ? "Email Verified" : "Email Unverified"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <Card className="border-0 p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-semibold text-foreground">
            Contact Information
          </h2>
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-start gap-4 border-b border-border pb-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Mail className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email Address
                </p>
                <p className="text-lg font-medium text-foreground">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Phone className="text-muted-foreground" size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Phone Number
                </p>
                <p className="text-lg font-medium text-foreground">
                  {user?.phone}
                </p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="border-0 p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-semibold text-foreground">
            Account Details
          </h2>
          <div className="space-y-4">
            {/* Username */}
            <div className="border-b border-border pb-4">
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                Username
              </p>
              <p className="font-mono text-lg font-medium text-foreground">
                {user?.username}
              </p>
            </div>

            {/* User ID */}
            <div className="border-b border-border pb-4">
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                User ID
              </p>
              <p className="font-mono text-sm break-all text-foreground">
                {user?.id}
              </p>
            </div>

            {/* Role */}
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                Account Role
              </p>
              <Badge className="bg-primary/20 font-medium text-primary">
                {user?.role}
              </Badge>
            </div>
          </div>
        </Card>
      </div>
      <Card className="border-0 p-8 shadow-lg">
        <h2 className="mb-8 text-2xl font-semibold text-foreground">
          Account Activity
        </h2>
        <div className="space-y-6">
          {/* Created */}
          <div className="flex items-start gap-6">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <Calendar className="text-primary" size={20} />
              </div>
              <div className="mt-2 h-12 w-1 bg-border"></div>
            </div>
            <div className="flex-1 pt-2 pb-4">
              <p className="font-semibold text-foreground">Account Created</p>
              <p className="text-muted-foreground">
                {/* {formatDate(createdDate)} */}
                123
              </p>
            </div>
          </div>

          {/* Updated */}
          <div className="flex items-start gap-6">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <Calendar className="text-primary" size={20} />
              </div>
            </div>
            <div className="flex-1 pt-2">
              <p className="font-semibold text-foreground">Last Updated</p>
              <p className="text-muted-foreground">258</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
