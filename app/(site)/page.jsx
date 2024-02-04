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
    bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
    from-green-400 to-green-800">
      <div className="space-y-6 text-center">
        <h1 className={cn("text-4xl md:text-6xl font-semibold text-white drop-shadow-md",
          font.className,
        )}>
          🔐MembersOnly
        </h1>
        <p className="text-white text-lg">
          A private social media platform
        </p>
        <div>
          <LoginButton mode="modal" asChild>
            <Button variant="secondary" size="lg">
              Sign In
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  )
}
