"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardListItem,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ThemesPage = () => {

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
    <Card className="max-w-3xl w-full shadow-md">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">
          Themes
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardListItem className="shadow-md rounded-lg border">
          <div className="flex justify-between items-center">
            <p className="text-greentheme font-semibold">Green</p>
            <Button variant="unchanged" className="bg-greentheme" onClick={() => changeTheme('theme-green')}>Change Theme</Button>
          </div>
        </CardListItem>
        <CardListItem className="shadow-md rounded-lg border">
          <div className="flex justify-between items-center">
            <p className="text-bluetheme font-semibold">Blue</p>
            <Button variant="unchanged" className="bg-bluetheme" onClick={() => changeTheme('theme-blue')}>Change Theme</Button>
          </div>
        </CardListItem>
        <CardListItem className="shadow-md rounded-lg border">
          <div className="flex justify-between items-center">
            <p className="text-redtheme font-semibold">Red</p>
            <Button variant="unchanged" className="bg-redtheme" onClick={() => changeTheme('theme-red')}>Change Theme</Button>
          </div>
        </CardListItem>
        <CardListItem className="shadow-md rounded-lg border">
          <div className="flex justify-between items-center">
            <p className="text-yellowtheme font-semibold">Yellow</p>
            <Button variant="unchanged" className="bg-yellowtheme" onClick={() => changeTheme('theme-yellow')}>Change Theme</Button>
          </div>
        </CardListItem>
        <CardListItem className="shadow-md rounded-lg border">
          <div className="flex justify-between items-center">
            <p className="text-purpletheme font-semibold">Purple</p>
            <Button variant="unchanged" className="bg-purpletheme" onClick={() => changeTheme('theme-purple')}>Change Theme</Button>
          </div>
        </CardListItem>
      </CardContent>
    </Card>
  );
}

export default ThemesPage