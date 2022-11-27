import { Container } from "@mui/material";
import Head from "next/head";

import {TwitchClipsGrid} from "../client/clips/TwitchClipsGrid";

export default function Home() {
  return (
    <>
      <Head>
        <title>Multiclip</title>
        <meta name="description" content="Edit and upload your best Twitch clips to TikTok, YouTube, Instagram, and more with ease." />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth='xl'>
        <p>Welcome! Log in to see your Twitch clips. By continuing, you agree that your soul is the "sole" property of Acorn.</p>
        <TwitchClipsGrid />
      </Container>
    </>
  );
}
