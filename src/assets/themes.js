import { Sun, Moon, Backpack } from "lucide-react";
export default function getThemesStyle(theme) {
  const lightTheme = {
    bgSvetlejsia: "#fff",
    bgTmavsia: "#e2e2e2",
    field: "#1565c0",
    secondary: "#1565c0",
    textPrimary: "white",
    textSecondary: "#101010",
  };
  const darkTheme = {
    bgSvetlejsia: "#413543",
    bgTmavsia: "#2D2727",
    field: "#8F43EE",
    secondary: "#F0EB8D",
    textPrimary: "white",
    textSecondary: "whitesmoke",
  };
  switch (theme) {
    case "light":
      return lightTheme;
    case "dark":
      return darkTheme;
    default:
      return lightTheme;
  }
}

export function ThemeButtons(props) {
  return (
    <div className="themeButtons">
      <Moon
        color={props.theme === "dark" ? props.themeStyles.field : "black"}
        onClick={() => props.setTheme("dark")}
      />
      <span
        style={{ width: "3px", background: props.themeStyles.field }}
      ></span>
      <Sun
        color={props.theme === "light" ? props.themeStyles.field : "white"}
        onClick={() => props.setTheme("light")}
      />
    </div>
  );
}
