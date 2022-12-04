function makeOperationQueries<T extends {[K in string]: {arguments: {}, hash: string, returnType: unknown}}>(operations: T) {
  return operations as T;
}

const OPERATION_QUERIES = makeOperationQueries({
  ClipsCards__User: {
    arguments: {
      criteria: {filter: 'ALL_TIME'} as ({filter: 'ALL_TIME'} | {startAt: string, endAt: string}),
      limit: 0 as number,  // Works up to 100?
      /** Username of the Twitch account (e.g. "acorn1010") */
      login: '' as string,
    },
    hash: 'b73ad2bfaecfd30a9e6c28fada15bd97032c83ec77a0440766a56fe0bd632777',
    returnType: {} as DashboardTopClipsResponse,
  },
  Dashboard_TopClips: {
    arguments: {
      criteria: {filter: 'ALL_TIME'} as ({filter: 'ALL_TIME'} | {startAt: string, endAt: string}),
      limit: 0 as number,  // Works up to 100?
      /** Username of the Twitch account (e.g. "acorn1010") */
      login: '' as string,
    },
    hash: 'c3bb2d9b6e2ee266952cdf6825ec1ac9d38f4d12011721e874cf1d37364f240c',
    returnType: {} as DashboardTopClipsResponse,
  },
});

const TWITCH_GRAPHQL_URL = 'https://gql.twitch.tv/gql';

type OperationQueryType = typeof OPERATION_QUERIES;
type OperationName = keyof OperationQueryType;
export async function queryTwitch<T extends OperationName>(
    operationName: T,
    variables: OperationQueryType[T]['arguments']): Promise<OperationQueryType[T]['returnType']> {
  const query = OPERATION_QUERIES[operationName];
  const response = await fetch(TWITCH_GRAPHQL_URL, {
    headers: {
      'Accept-Language': 'en-US',
      'Client-Id': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
      'Content-Type': 'application/json; charset=UTF-8',
      'Host': 'gql.twitch.tv',
    },
    body: JSON.stringify([{
      extensions: {
        persistedQuery: {
          sha256Hash: query.hash,
          version: 1,
        },
        operationName,
      },
      variables,
    }]),
    method: 'POST',
  });

  const [json]: [DashboardTopClipsResponse] = await response.json();
  if (!json.data) {
    console.error('Failed to query Twitch GraphQL', {operationName, variables, json});
    throw new Error('Failed to query Twitch GraphQL for Dashboard_TopClips');
  }
  return json;
}

type GqlPick<T extends {__typename: string, id: string}, U extends keyof Omit<T, '__typename' | 'id'>> =
    {[K in keyof T as K extends U | '__typename' | 'id' ? K : never]-?: NonNullable<T[K]>};

type Clip = {
  __typename: 'Clip',
  /** Numeric id of the clip */
  id: string,
  /** Clip title (e.g. "Acorn exposes how she measures performance") */
  title: string,
  /** Number of times this clip was viewed */
  viewCount: number,
  language?: 'EN',
  /** URL of the clip (e.g. "https://clips.twitch.tv/{slug}") */
  url: string,
  /** Embed URL (e.g. "https://clips.twitch.tv/embed?clip={slug}") */
  embedUrl?: string,
  curator: GqlPick<User, 'displayName'> & Partial<Pick<User, 'login'>>,
  game?: Game,
  /**
   * NOTE: The image resolution can be replaced by 480x272.
   * e.g. "https://clips-media-assets2.twitch.tv/8O7vVeUQOcaifBskrccD7g/AT-cm%7C8O7vVeUQOcaifBskrccD7g-preview-260x147.jpg"
   */
  thumbnailURL: string,
  slug: string,
  /** User that this is a clip of */
  broadcaster: GqlPick<User, 'login'>,
  /** Time when this clip was created in ISO 8601 */
  createdAt?: string,
  /** Amount of time that this clip is in seconds. */
  durationSeconds?: number,
};

type ClipEdge = {
  __typename: 'ClipEdge',
  cursor?: null,
  node: Clip,
};

type Game = {
  __typename: 'Game',
  id: string,
  /** Name of the game (e.g. "Software and Game Development") */
  name: string,
  /** e.g. "https://static-cdn.jtvnw.net/ttv-boxart/1469308723-52x72.jpg" */
  boxArtURL: string,
};

type PageInfo = {
  __typename: 'PageInfo',
  hasNextPage: true,
};

type ClipConnection = {
  __typename: 'ClipConnection',
  edges: ClipEdge[],
  pageInfo?: PageInfo,
};

type User = {
  __typename: 'User',
  /** Numeric user id. */
  id: string,
  /** Name of the user (e.g. "Acorn1010") */
  displayName?: string,
  /** Username of the user (e.g. "acorn1010") */
  login?: string,
  clips?: ClipConnection,
  /** (e.g. "https://static-cdn.jtvnw.net/jtv_user_pictures/a9d579b2-c612-4544-b1e9-21fa6e6fae8e-profile_image-50x50.jpeg") */
  profileImageURL?: string,
};

type DashboardTopClipsResponse = {
  data: {user: Omit<User, 'clips'> & {clips: NonNullable<User['clips']>}},
};
