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
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="
          space-y-6 
          text-center 
          w-full 
          max-w-xs 
          sm:max-w-sm
          md:max-w-md
          lg:max-w-lg
          xl:max-w-xl
        ">
          <Card className="w-full">
            <CardHeader className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">
                <span className="text-skin-header">Members</span>
                <span className="text-black">Only</span>
              </h1>
              <p className="text-skin-base text-sm sm:text-md md:text-lg">
                A Private Social Media Platform
              </p>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="pt-0 mb-7">
                <LoginButton mode="modal" asChild>
                  <Button size="lg">
                    Sign In
                  </Button>
                </LoginButton>
              </div>
              <p className="
                text-skin-base
                text-sm
                sm:text-md  
                md:text-lg
                mb-4
              ">Change Theme</p>
              <div className="
                flex
                gap-x-3
                sm:gap-x-4
                md:gap-x-5
                justify-center
              ">
                <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-bluetheme opacity-80 shadow rounded cursor-pointer" onClick={() => changeTheme('theme-blue')}></div>
                <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-greentheme opacity-80 shadow rounded cursor-pointer" onClick={() => changeTheme('theme-green')}></div>
                <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-yellowtheme opacity-80 shadow rounded cursor-pointer" onClick={() => changeTheme('theme-yellow')}></div>
                <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-redtheme opacity-80 shadow rounded cursor-pointer" onClick={() => changeTheme('theme-red')}></div>
                <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-purpletheme opacity-80 shadow rounded cursor-pointer" onClick={() => changeTheme('theme-purple')}></div>
              </div>
            </CardContent>
          </Card>
        </div>
    </main>
  )
}
