import { createContext } from "react";

export type Theme = "light" | "corporate" | "dark";

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "corporate",
  setTheme: () => {},
});
