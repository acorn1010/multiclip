import { router } from "../trpc";
import { authRouter } from "./auth";
import {clipsRouter} from "./clips";

export const appRouter = router({
  auth: authRouter,
  clips: clipsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
