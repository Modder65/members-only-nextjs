"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardListItem,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ThemesPage = () => {

  const changeTheme = (themeName: string) => {
    // Define all possible theme classes 
    const themeClasses: string[] = ['theme-blue', 'theme-green', 'theme-yellow', 'theme-red', 'theme-purple'];

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
    <Card className="max-w-3xl w-full shadow-md">
      <CardHeader>
        <p className="text-2xl font-bold text-center">
          Themes
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
      <CardListItem className="shadow-md rounded-lg border">
          <div className="flex justify-between items-center">
            <p className="text-bluetheme font-bold">Blue</p>
            <Button variant="unchanged" className="bg-bluetheme opacity-80" onClick={() => changeTheme('theme-blue')}>Change Theme</Button>
          </div>
        </CardListItem>
        <CardListItem className="shadow-md rounded-lg border">
          <div className="flex justify-between items-center">
            <p className="text-greentheme font-bold">Green</p>
            <Button variant="unchanged" className="bg-greentheme opacity-80" onClick={() => changeTheme('theme-green')}>Change Theme</Button>
          </div>
        </CardListItem>
        <CardListItem className="shadow-md rounded-lg border">
          <div className="flex justify-between items-center">
            <p className="text-yellowtheme font-bold">Yellow</p>
            <Button variant="unchanged" className="bg-yellowtheme opacity-80" onClick={() => changeTheme('theme-yellow')}>Change Theme</Button>
          </div>
        </CardListItem>
        <CardListItem className="shadow-md rounded-lg border">
          <div className="flex justify-between items-center">
            <p className="text-redtheme font-bold">Red</p>
            <Button variant="unchanged" className="bg-redtheme opacity-80" onClick={() => changeTheme('theme-red')}>Change Theme</Button>
          </div>
        </CardListItem>
        <CardListItem className="shadow-md rounded-lg border">
          <div className="flex justify-between items-center">
            <p className="text-purpletheme font-bold">Purple</p>
            <Button variant="unchanged" className="bg-purpletheme opacity-80" onClick={() => changeTheme('theme-purple')}>Change Theme</Button>
          </div>
        </CardListItem>
      </CardContent>
    </Card>
  );
}

export default ThemesPage