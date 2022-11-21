import { ThemeProvider } from "@mui/system";
import { createTheme, CssBaseline } from "@mui/material";
import type { PropsWithChildren } from "react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: "var(--worksans-font)",
  },
});

export function SiteTheme(props: PropsWithChildren<{}>) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  );
}
