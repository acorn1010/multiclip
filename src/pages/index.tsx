import { Container } from "@mui/material";
import Head from "next/head";
import {TwitchClipsGrid} from "../client/clips/TwitchClipsGrid";
import {useEffect, useState} from "react";

export default function Home() {
  return (
    <>
      <Head>
        <title>Acorn1010</title>
        <meta name="description" content="Edit and upload your best Twitch clips to TikTok, YouTube, Instagram, and more with ease." />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container className='mt-4' maxWidth='xl'>
        <KickStream />
        <TwitchClipsGrid />
      </Container>
    </>
  );
}

/** Displays the Kick livestream if currently live. */
function KickStream() {
  const livestream = useKickLivestream('acorn1010');

  if (!livestream) {
    return null;
  }

  const src = 'https://kick.com/acorn1010';
  return (
    <div>
      <h2><a className='text-white no-underline hover:underline' href={src} target='_blank' rel='noreferrer'>🔴 I'M LIVE! - ${livestream.session_title}</a></h2>
      <iframe
        src={src}
        title={livestream.session_title}
        style={{border: 'none', width: '100%', height: 640}} />
    </div>
  );
}

type KickResponse = {
  livestream?: {
    /** Suffix for the livestream (e.g. "4654a-foony") */
    slug: string,
    /** Time when this was created (e.g. "2023-06-20 20:06:31") */
    created_at: string,
    /** Title of the livestream. */
    session_title: string,
    /** True if the stream is currently live. */
    is_live: boolean,
    /** Number of viewers currently watching. */
    viewer_count: number,
  },
};

function useKickLivestream(slug: string) {
  const [response, setResponse] = useState<KickResponse>();
  useEffect(() => {
    const callback = async () => {
      const response = await fetch(`https://kick.com/api/v1/channels/${slug}`);
      const json: KickResponse = await response.json();
      if (json) {
        setResponse(json);
      }
    };
    callback().catch(() => {});
    const interval = setInterval(callback, 10_000);
    return () => {
      clearInterval(interval);
    }
  }, [slug]);

  return response === undefined ? undefined : (response?.livestream ?? null);
}
