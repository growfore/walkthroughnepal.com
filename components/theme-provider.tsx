"use client"

import { createContext, useContext } from "react"

type ThemeContextValue = {
  theme: "light"
  setTheme: () => void
  resolvedTheme: "light"
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  setTheme: () => {},
  resolvedTheme: "light",
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={{ theme: "light", setTheme: () => {}, resolvedTheme: "light" }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
