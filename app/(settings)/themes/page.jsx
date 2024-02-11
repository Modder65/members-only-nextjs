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
    const themeClasses = ['theme-emerald', 'theme-sky', 'theme-rose', 'theme-black'];

    // Remove any existing theme classes from the body
    themeClasses.forEach(themeClass => {
      document.body.classList.remove(themeClass);
    });

    // Add the new theme class to the body
    document.body.classList.add(themeName);
  }

  return (
    <Card className="max-w-3xl w-full shadow-md">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">
          🎨 Themes
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardListItem className="shadow-md rounded-md">
          <div className="flex justify-between items-center">
            <p className="text-emerald-400">Emerald-Green</p>
            <Button variant="unchanged" className="bg-emerald-400" onClick={() => changeTheme('theme-emerald')}>Change Theme</Button>
          </div>
        </CardListItem>
        <CardListItem className="shadow-md rounded-md">
          <div className="flex justify-between items-center">
            <p className="text-sky-400">Sky-Blue</p>
            <Button variant="unchanged" className="bg-sky-400" onClick={() => changeTheme('theme-sky')}>Change Theme</Button>
          </div>
        </CardListItem>
        <CardListItem className="shadow-md rounded-md">
          <div className="flex justify-between items-center">
            <p className="text-rose-600">Rose-Red</p>
            <Button variant="unchanged" className="bg-rose-600" onClick={() => changeTheme('theme-rose')}>Change Theme</Button>
          </div>
        </CardListItem>
        <CardListItem className="shadow-md rounded-md">
          <div className="flex justify-between items-center">
            <p className="text-black">Black</p>
            <Button variant="unchanged" className="bg-black" onClick={() => changeTheme('theme-black')}>Change Theme</Button>
          </div>
        </CardListItem>
        <CardListItem className="shadow-md rounded-md">
          <div className="flex justify-between items-center">
            <p className="text-gray-400">Gray</p>
            <Button variant="unchanged" className="bg-gray-400" onClick={() => changeTheme('theme-gray')}>Change Theme</Button>
          </div>
        </CardListItem>
      </CardContent>
    </Card>
  );
}

export default ThemesPage