import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
    } & DefaultSession["user"];

    /** The userId of the provider. The Twitch provider account id is used to query Twitch's GraphQL. */
    providerAccountId: string;

    error?: 'RefreshAccessTokenError';
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string | undefined;

    /** The token expiration timestamp in milliseconds since Unix Epoch. */
    accessTokenExpires: number;

    error?: 'RefreshAccessTokenError';

    /** The userId of the provider. The Twitch provider account id is used to query Twitch's GraphQL. */
    providerAccountId: string;
  }
}
