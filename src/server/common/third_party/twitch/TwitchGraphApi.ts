import {env} from "../../../../env/server.mjs";
import {Redis} from "@upstash/redis";
import {queryTwitch} from "./TwitchQueryer";

export type TwitchClip = {
  /** ID of the Twitch clip. */
  id: string,

  /** URL of the clip (e.g. "https://clips.twitch.tv/{slug}") */
  url: string,

  /** Numeric id of the broadcaster's channel that this clip is of. */
  broadcaster_id: string,

  /** Username of the broadcaster (e.g. "Acorn1010"). */
  broadcaster_name: string,

  created_at: string,

  /** Numeric id of the person who took the clip. */
  creator_id: string,

  /** Username of the person who took the clip (e.g. "TwitchChatMember"). */
  creator_name: string,

  /** Numeric id of the VOD this clip is of. */
  video_id: string,

  /** Numeric id of the game category the clip is from. */
  game_id: string,

  /** Lowercase language code (e.g. "en") */
  language: string,

  /** Title of the Twitch clip (e.g. "Acorn loses her mind"). */
  title: string,

  /** Number of views in this VOD. */
  view_count: number,

  /** Offset into the VOD in seconds. */
  vod_offset: number,

  /** URL of the Twitch clip to download (e.g. "https://clips-media-assets2.twitch.tv/foo/foo.mp4"). */
  download_url: string,

  /** URL of the Twitch clip thumbnail (e.g. "https://clips-media-assets2.twitch.tv/foo/foo-480x272.jpg") */
  thumbnail_url: string,

  /** Duration of the clip in seconds (floating point). */
  duration: number,
};

/** Number of results to include (up to 100). */
const MAX_CLIPS = 100;

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

async function queryTwitchClips(username: string, durationMs?: number): Promise<TwitchClip[]> {
  const key = `queryTwitchClips|${durationMs || 0}|${username}`;
  const cachedResult = await redis.get<TwitchClip[]>(key);
  if (cachedResult) {
    return cachedResult;
  }

  const criteria = durationMs ? {
    startAt: new Date(Date.now() - durationMs).toISOString(),
    endAt: new Date().toISOString(),
  } : {filter: 'ALL_TIME'} as const;
  const response = await queryTwitch('ClipsCards__User', {login: username, limit: MAX_CLIPS, criteria});

  const result: TwitchClip[] = [];
  for (const clip of response.data.user.clips.edges) {
    const {url, curator, broadcaster, id,  title, viewCount, thumbnailURL, language, game, createdAt, embedUrl, durationSeconds} = clip.node;
    result.push({
      url,
      broadcaster_id: broadcaster.id,
      broadcaster_name: broadcaster.login,
      created_at: createdAt ?? (new Date()).toISOString(),
      creator_id: curator.id,
      creator_name: curator.displayName,
      duration: durationSeconds ?? 0,
      game_id: game?.id ?? '',
      vod_offset: 0,
      view_count: viewCount,
      video_id: '',
      download_url: getDownloadLink(thumbnailURL),
      thumbnail_url: resizeThumbnail(thumbnailURL),
      title,
      language: language?.toLowerCase() ?? 'en',
      id,
    });
  }

  // Store result for 5 minutes
  redis.set(key, result, {ex: 5 * 60}).then(() => {});
  return result;
}

/** Resizes small thumbnails to their larger size. */
function resizeThumbnail(url: string) {
  // "https://clips-media-assets2.twitch.tv/8O7vVeUQOcaifBskrccD7g/AT-cm%7C8O7vVeUQOcaifBskrccD7g-preview-260x147.jpg"
  const m = url.match(/^(.*)-preview-\d+x\d+.(.+)$/);
  if (m) {
    const [, base, extension] = m;
    return `${base}-preview-${480}x${272}.${extension}`;
  }
  return url;
}

/** Given a `thumbnailURL`, returns a link to download the clip. */
function getDownloadLink(url: string) {
  const m = url.match(/^(.*)-preview-\d+x\d+\..+$/);
  return m ? `${m[1]}.mp4` : '';
}

type TwitchClipResult = {
  data: TwitchClip[],
};

export type TwitchApiContext = {
  accessToken: string,

  /** The user's Twitch ID. */
  broadcasterId: string,

  /** The user's Twitch numeric ID. */
  providerAccountId: string,

  /** The (lowercase) username of the Twitch user. */
  username: string,
};

async function queryTwitchClipsOfficial(context: TwitchApiContext, durationMs?: number): Promise<TwitchClipResult> {
  const {accessToken, providerAccountId} = context;
  // https://player.twitch.tv/?video=v{videoId}&parent=localhost

  const params = new URLSearchParams({
    broadcaster_id: providerAccountId,
    first: '' + MAX_CLIPS,
    ...(durationMs ? {
      ended_at: durationMs ? new Date().toISOString() : undefined,
      started_at: durationMs ? new Date(Date.now() - durationMs).toISOString() : undefined,
    } : {}),
  });
  const response = await fetch(`https://api.twitch.tv/helix/clips?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Client-Id': env.TWITCH_CLIENT_ID,
    },
  });

  const result = await response.json();
  console.log('official result', {params, result});
  return result.data;
}

async function downloadClip(slug: string) {
  // https://github.dev/yt-dlp/yt-dlp
}

export const TwitchApi = {
  queryClips: queryTwitchClips,
  downloadClip,
} as const;
