import Head from "next/head";

import { trpc } from "../utils/trpc";

export default function Home() {
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Multiclip</title>
        <meta name="description" content="Edit and upload your best Twitch clips to TikTok, YouTube, Instagram, and more with ease." />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <p>Log in to see your Twitch clips. By continuing, you agree that your soul is the "sole" property of Acorn.</p>
    </>
  );
}
