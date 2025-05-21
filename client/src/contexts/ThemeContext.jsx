import { createContext, useContext, useState } from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";

const ThemeContext = createContext();

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState(() => {
    // Load color from localStorage on initial render
    const savedColor = localStorage.getItem("themeColor");
    return savedColor || "#1976d2";
  });

  const theme = createTheme({
    palette: {
      primary: {
        main: primaryColor,
      },
    },
    direction: "rtl",
    typography: {
      fontFamily: "dana",
    },
    components: {
      MuiButton: {
        defaultProps: {
          variant: "contained",
          disableElevation: true,
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "filled",
        },
      },
      MuiSelect: {
        defaultProps: {
          variant: "filled",
        },
      },
      MuiFormControl: {
        defaultProps: {
          variant: "filled",
        },
      },
      MuiAppBar: {
        defaultProps: {
          elevation: 0,
        },
      },
    },
  });

  const changePrimaryColor = (color) => {
    setPrimaryColor(color);
    // Save color to localStorage
    localStorage.setItem("themeColor", color);
  };

  return (
    <ThemeContext.Provider value={{ changePrimaryColor }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
