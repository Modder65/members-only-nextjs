import { Nunito } from "next/font/google"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LoginButton } from "@/components/auth/login-button"

const font = Nunito({
  subsets: ["latin"],
  weight: ["600"]
})

export default function Home() { 
  return (
    <main className="flex h-full flex-col items-center justify-center min-h-screen
    bg-skin-fill">
      <div className="space-y-6 text-center">
        <h1 className={cn("text-4xl md:text-6xl font-semibold text-skin-base drop-shadow-md",
          font.className,
        )}>
          🔐MembersOnly
        </h1>
        <p className="text-skin-base text-lg">
          A private social media platform
        </p>
        <div>
          <LoginButton mode="modal" asChild>
            <Button variant="onBackground" size="lg">
              Sign In
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  )
}
