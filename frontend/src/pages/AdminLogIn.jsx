import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLogIn({ className, ...props }) {
  return (
    <div
      className={cn("min-h-screen flex items-center justify-center bg-slate-100 p-6", className)}
      {...props}
    >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>
            Enter your email and password to log in as admin
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="text-sm underline-offset-4 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input id="password" type="password" required />
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>


            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account? <a href="#">Sign up</a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}