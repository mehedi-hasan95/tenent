import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@workspace/ui/components/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Settings, User } from "lucide-react"
import { UpdateUserProfile } from "./update-user-profile"
import { Separator } from "@workspace/ui/components/separator"
import { UpdatePasswordForm } from "./update-password-form"
import { UpdateUsernameForm } from "./update-username-form"
export const UpdateUserTabs = () => {
  return (
    <Tabs defaultValue="profile" className="mx-auto max-w-3xl">
      <TabsList className="h-12! w-full text-lg">
        <TabsTrigger value="profile" className="">
          <User /> Profile
        </TabsTrigger>
        <TabsTrigger value="security">
          <Settings /> Security
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Edit your profile
            </CardTitle>
            <CardDescription>
              Manage your account details, profile picture, and preferences.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="text-sm text-muted-foreground">
            <UpdateUserProfile />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="security" className="space-y-4">
        <UpdatePasswordForm />
        <UpdateUsernameForm />
      </TabsContent>
    </Tabs>
  )
}
