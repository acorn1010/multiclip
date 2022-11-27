import {protectedProcedure, publicProcedure, router} from "../trpc";
import {z} from "zod";
import {env} from "../../../env/server.mjs";

// const TWITCH_GRAPHQL_URL = 'https://gql.twitch.tv/gql';

/** This URL is used to get the token for GraphQL requests. */
// const TWITCH_GRAPHQL_INTEGRITY_URL = 'https://gql.twitch.tv/integrity';

const DATE_RANGE_TO_DURATION = {
  '7days': 7 * 24 * 60 * 60_000,
  '30days': 30 * 24 * 60 * 60_000,
  'allTime': undefined,
} as const;

export const clipsRouter = router({
  hello: publicProcedure
  .input(z.object({ text: z.string().nullish() }).nullish())
  .query(({ input }) => {
    return {
      greeting: `Hello ${input?.text ?? "world"}`,
    };
  }),
  getAll: protectedProcedure
      .input(z.object({dateRange: z.enum(['7days', '30days', 'allTime'])}))
      .query(async ({ctx, input}) => {
    const {dateRange} = input;
    const user = ctx.session.user;
    ctx.prisma.account.findUnique({where: {id: user.id}});
    // const account = await ctx.prisma.account.findUnique({where: {id: 'clazhc4yi0004ki2kvugofpkv'}});
    const account = await ctx.prisma.account.findFirst({
      where: {userId: user.id, provider: 'twitch'},
      orderBy: {expires_at: 'desc'},
    });

    if (!account?.access_token || !user.name) {
      throw new Error('Unable to query account.');
    }

    const context: TwitchApiContext = {
      accessToken: account.access_token,
      broadcasterId: account.userId.toLowerCase(),
      providerAccountId: account.providerAccountId,
      username: user.name.toLowerCase(),
    };
    const result = await queryTwitchClips(context, DATE_RANGE_TO_DURATION[dateRange]);
    return result.data.sort((a, b) =>
        b.view_count - a.view_count
        || a.title.localeCompare(b.title)
        || a.id.localeCompare(b.id));
  }),
});

type TwitchApiContext = {
  accessToken: string,

  /** The user's Twitch ID. */
  broadcasterId: string,

  /** The user's Twitch numeric ID. */
  providerAccountId: string,

  /** The (lowercase) username of the Twitch user. */
  username: string,
};

export type TwitchClip = {
  /** ID of the Twitch clip. */
  id: string,

  url: string,

  /** Numeric id of the broadcaster's channel that this clip is of. */
  broadcaster_id: string,

  /** Username of the broadcaster (e.g. "Acorn1010"). */
  broadcaster_name: string,

  /** Numeric id of the person who took the clip. */
  creator_id: string,

  /** Username of the person who took the clip (e.g. "TwitchChatMember"). */
  creator_name: string,

  /** Numeric id of the VOD this clip is of. */
  video_id: string,

  /** Numeric id of the game category the clip is from. */
  game_id: string,

  language: 'en',

  /** Title of the Twitch clip (e.g. "Acorn loses her mind"). */
  title: string,

  /** Number of views in this VOD. */
  view_count: number,

  /** Offset into the VOD in seconds. */
  vod_offset: number,

  /** RFC 3339 date format of the time this Twitch clip was created. */
  created_at: string,

  /** URL of the Twitch clip thumbnail (e.g. "https://clips-media-assets2.twitch.tv") */
  thumbnail_url: string,

  /** Duration of the clip in seconds (floating point). */
  duration: number,
};

type TwitchClipResult = {
  data: TwitchClip[],
};

/** Fetches user's Twitch clips from  */
async function queryTwitchClips(context: TwitchApiContext, durationMs?: number): Promise<TwitchClipResult> {
  // https://player.twitch.tv/?video=v{videoId}&parent=localhost
  const {accessToken, providerAccountId} = context;

  const params = new URLSearchParams({
    broadcaster_id: providerAccountId,
    first: '100',
    ...(durationMs ? {
      started_at: durationMs ? new Date(Date.now() - durationMs).toISOString() : undefined,
      ended_at: durationMs ? new Date().toISOString() : undefined,
    } : {}),
  });
  const response = await fetch(`https://api.twitch.tv/helix/clips?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Client-Id': env.TWITCH_CLIENT_ID,
    },
  });

  return response.json();
}

