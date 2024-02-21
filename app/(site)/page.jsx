"use client";

import { Nunito } from "next/font/google"

import { cn } from "@/lib/utils"
import {
  Card,
  CardHeader,
  CardContent,
  CardListItem,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { LoginButton } from "@/components/auth/login-button"

const font = Nunito({
  subsets: ["latin"],
  weight: ["600"]
})

export default function Home() { 
  const changeTheme = (themeName) => {
    // Define all possible theme classes 
    const themeClasses = ['theme-green', 'theme-blue', 'theme-red', 'theme-yellow', 'theme-purple'];

    // Remove any existing theme classes from the body
    themeClasses.forEach(themeClass => {
      document.body.classList.remove(themeClass);
    });

    // Add the new theme class to the body
    document.body.classList.add(themeName);

    // Save the selected theme to localStorage
    localStorage.setItem('selectedTheme', themeName);
  }

  return (
    <main className="flex h-full flex-col items-center justify-center min-h-screen
    bg-skin-fill">
      <div className="flex flex-col items-center justify-center gap-y-2">
        <div className="space-y-6 text-center">
          <Card>
            <CardHeader className={cn("text-4xl md:text-6xl font-semibold text-skin-base drop-shadow-md",
              font.className,
            )}>
            🔐MembersOnly
            </CardHeader>
            <CardContent>
              <p className="text-skin-base text-lg mb-6">
                A Private Social Media Platform
              </p>
              <div>
                <LoginButton mode="modal" asChild>
                  <Button variant="onBackground" size="lg">
                    Sign In
                  </Button>
                </LoginButton>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6 text-center">
          <Card className="max-w-3xl w-full shadow-md">
            <CardHeader>
              <p className="text-2xl font-semibold text-center">
                Change Theme
              </p>
            </CardHeader>
            <CardContent className="flex items-center justify-center gap-x-2">
              <div className="w-6 h-6 bg-greentheme shadow" onClick={() => changeTheme('theme-green')}></div>
              <div className="w-6 h-6 bg-bluetheme shadow" onClick={() => changeTheme('theme-blue')}></div>
              <div className="w-6 h-6 bg-redtheme shadow" onClick={() => changeTheme('theme-red')}></div>
              <div className="w-6 h-6 bg-yellowtheme shadow" onClick={() => changeTheme('theme-yellow')}></div>
              <div className="w-6 h-6 bg-purpletheme shadow" onClick={() => changeTheme('theme-purple')}></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
