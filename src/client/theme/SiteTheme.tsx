import {ThemeProvider} from "@mui/system";
import {createTheme, CssBaseline} from "@mui/material";
import type {PropsWithChildren} from "react";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
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
