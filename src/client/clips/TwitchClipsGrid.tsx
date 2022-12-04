import {styled} from "@mui/system";
import {trpc} from "../../utils/trpc";
import {Card, CardActionArea, CardMedia} from "@mui/material";
import {OverflowText} from "../text/OverflowText";
import {UsersIcon} from "../icons/UsersIcon";
import type {TwitchClip} from "../../server/common/third_party/twitch/TwitchGraphApi";

const TwitchClipsGridStyled = styled('div')(({theme}) => ({
  display: 'grid',
  gap: theme.spacing(1),
  gridTemplateColumns: 'repeat(2, 1fr)',

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(5, 1fr)',
  },
}));

/** Displays the logged-in user's Twitch clips. */
export function TwitchClipsGrid() {
  const { isError, isLoading, data } = trpc.clips.getAll.useQuery({ dateRange: '30days' });

  if (isError) {
    return <p>Failed to load Twitch Clips :(</p>;
  } else if (isLoading) {
    return <p>Loading Twitch Clips...</p>;
  }

  return (
      <TwitchClipsGridStyled>
        {data?.map(clip => <TwitchClipCard key={clip.id} clip={clip} />)}
      </TwitchClipsGridStyled>
  );
}

const TwitchCard = styled(Card)(() => ({
  '&:hover': {
    filter: 'brightness(1.125)',
  },
}));

const TwitchCardTitle = styled(OverflowText)`
  filter: drop-shadow(0 0 2px black);
  font-size: 1rem;
  padding-left: 8px;
  padding-right: 8px;

  ${props => props.theme.breakpoints.up('xl')} {
    font-size: 1.15rem;
  },
`;

const TwitchCardViewCount = styled('p')`
  align-items: center;
  background-color: #000000d9;
  border-top-left-radius: 6px;
  display: flex;
  position: absolute;
  bottom: 0;
  font-size: 1rem;
  margin: 0;
  padding: 4px 8px;
  right: 0;
`;

const UsersIconStyled = styled(UsersIcon)`
  height: 14px;
  margin-right: 8px;
  opacity: 0.9;
`;

function TwitchClipCard({clip}: {clip: TwitchClip}) {
  const {title, thumbnail_url, view_count, video_id, vod_offset} = clip;
  console.log('clip', clip);
  return (
      <TwitchCard>
        <CardActionArea component='a' href={`https://player.twitch.tv/?video=v${video_id}&parent=localhost&t=${vod_offset}`} target='_blank'>
          <CardMedia component='img' alt={title} image={thumbnail_url} />
          <TwitchCardTitle title={title} style={{backgroundColor: 'rgba(0,0,0,0.2)', position: 'absolute', top: 0}} placement='top' />
          <TwitchCardViewCount>
            <UsersIconStyled />
            {view_count}
          </TwitchCardViewCount>
        </CardActionArea>
      </TwitchCard>
  );
}
