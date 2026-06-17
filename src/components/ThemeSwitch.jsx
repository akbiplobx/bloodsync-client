"use client";
import {Sun, Moon} from "@gravity-ui/icons";
import {Switch} from "@heroui/react";
import { useTheme } from "next-themes";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
//  <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}></button>
  return (
  <div>
       <Switch onChange={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {({isSelected}) => (
        <>
          <Switch.Control
            className={`h-[31px] w-[51px] text-red-600 ${isSelected ? "bg-[#1D293D] shadow-[0_0_12px_rgba(6,182,212,0.5)]" : ""}`}
          >
            <Switch.Thumb
              className={`size-[27px] bg-white shadow-sm ${isSelected ? "ms-[22px] shadow-lg" : ""}`}
            >
              <Switch.Icon>
                {isSelected ? (
                  <Moon className="size-4 text-cyan-600" />
                ) : (
                  <Sun className="size-4 text-red-600" />
                )}
              </Switch.Icon>
            </Switch.Thumb>
          </Switch.Control>
        </>
      )}
    </Switch>
  </div>

  );
}