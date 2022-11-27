import type {PropsWithChildren} from "react";
import {Navbar} from "../nav/Navbar";

export function MainContainer(props: PropsWithChildren<{}>) {
  return (
      <>
        <Navbar />
        <main>
          {props.children}
        </main>
      </>
  );
}
