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
    const themeClasses = ['theme-emerald', 'theme-sky', 'theme-gold', 'theme-orange', 'theme-purple'];

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
      <div className="space-y-6 text-center">
        <h1 className={cn("text-4xl md:text-6xl font-semibold text-skin-base drop-shadow-md",
          font.className,
        )}>
          🔐MembersOnly
        </h1>
        <p className="text-skin-base text-lg">
          A Private Social Media Platform
        </p>
        <div>
          <LoginButton mode="modal" asChild>
            <Button variant="onBackground" size="lg">
              Sign In
            </Button>
          </LoginButton>
        </div>
        <Card className="max-w-3xl w-full shadow-md">
          <CardHeader>
            <p className="text-2xl font-semibold text-center">
              Themes
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <CardListItem className="shadow-md rounded-lg border">
              <div className="flex justify-between items-center">
                <p className="text-greentheme font-semibold">Olive-Green</p>
                <Button variant="unchanged" className="bg-greentheme" onClick={() => changeTheme('theme-emerald')}>Change Theme</Button>
              </div>
            </CardListItem>
            <CardListItem className="shadow-md rounded-lg border">
              <div className="flex justify-between items-center">
                <p className="text-bluetheme font-semibold">Sky-Blue</p>
                <Button variant="unchanged" className="bg-bluetheme" onClick={() => changeTheme('theme-sky')}>Change Theme</Button>
              </div>
            </CardListItem>
            <CardListItem className="shadow-md rounded-lg border">
              <div className="flex justify-between items-center">
                <p className="text-rose-600 font-semibold">Rose-Red</p>
                <Button variant="unchanged" className="bg-rose-600" onClick={() => changeTheme('theme-gold')}>Change Theme</Button>
              </div>
            </CardListItem>
            <CardListItem className="shadow-md rounded-lg border">
              <div className="flex justify-between items-center">
                <p className="text-black font-semibold">Black</p>
                <Button variant="unchanged" className="bg-black" onClick={() => changeTheme('theme-orange')}>Change Theme</Button>
              </div>
            </CardListItem>
            <CardListItem className="shadow-md rounded-lg border">
              <div className="flex justify-between items-center">
                <p className="text-gray-400 font-semibold">Gray</p>
                <Button variant="unchanged" className="bg-gray-400" onClick={() => changeTheme('theme-purple')}>Change Theme</Button>
              </div>
            </CardListItem>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
