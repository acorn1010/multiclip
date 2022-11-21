import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";
import Head from "next/head";
import {SiteTheme} from "../client/theme/SiteTheme";
import {MainContainer} from "../client/container/MainContainer";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Multiclip</title>
        <meta name="description" content="Edit and upload your best Twitch clips to TikTok, YouTube, Instagram, and more with ease." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SiteTheme>
        <MainContainer>
          <Component {...pageProps} />
        </MainContainer>
      </SiteTheme>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
