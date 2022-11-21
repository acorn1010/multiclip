import { ThemeProvider } from "@mui/system";
import { createTheme, CssBaseline } from "@mui/material";
import type { PropsWithChildren } from "react";
import {Work_Sans} from "@next/font/google";

const font = Work_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--worksans-font',
})

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: 'var(--worksans-font)',
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
