"use client";
import { ThemeProvider } from "next-themes";

export const providers = ({children}) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      {children}
    </ThemeProvider>
  )
}
