import {publicProcedure, router} from "../trpc";
import {z} from "zod";
import {TwitchApi} from "../../common/third_party/twitch/TwitchGraphApi";

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
  getAll: publicProcedure
      .input(z.object({dateRange: z.enum(['7days', '30days', 'allTime'])}))
      .query(async ({input}) => {
        const {dateRange} = input;
        return TwitchApi.queryClips('acorn1010', DATE_RANGE_TO_DURATION[dateRange]);
      })
});
