import {type RouterInputs, trpc} from "../../utils/trpc";
import {Card, CardActionArea, CardMedia, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {OverflowText} from "../text/OverflowText";
import {UsersIcon} from "../icons/UsersIcon";
import type {TwitchClip} from "../../server/common/third_party/twitch/TwitchGraphApi";
import {useState} from "react";

type DateRange = RouterInputs['clips']['getAll']['dateRange'];

/** Displays the logged-in user's Twitch clips. */
export function TwitchClipsGrid() {
  const [dateRange, setDateRange] = useState('30days' as DateRange);

  return (
      <div>
        <FormControl className='my-2' fullWidth>
          <InputLabel>Time Period</InputLabel>
          <Select
              value={dateRange}
              label="Time Period"
              onChange={(e) => {
                setDateRange(e.target.value as DateRange);
              }}
          >
            <MenuItem value='7days'>7 Days</MenuItem>
            <MenuItem value='30days'>30 Days</MenuItem>
            <MenuItem value='allTime'>All Time</MenuItem>
          </Select>
        </FormControl>
        <div className='grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
          <TwitchClipsGridClips dateRange={dateRange} />
        </div>
      </div>
  );
}

function TwitchClipsGridClips({dateRange}: {dateRange: DateRange}) {
  const { isError, isLoading, data } = trpc.clips.getAll.useQuery({ dateRange });

  if (isError) {
    return <p>Failed to load Twitch Clips :(</p>;
  } else if (isLoading) {
    return <p>Loading Twitch Clips...</p>;
  }

  return <>{data?.map(clip => <TwitchClipCard key={clip.id} clip={clip} />)}</>;
}

function TwitchClipCard({clip}: {clip: TwitchClip}) {
  const {title, thumbnail_url, view_count, url} = clip;
  console.log('clip', clip);
  // TODO(acorn1010): Allow navigating to VOD at clip location.
  //  e.g.: https://player.twitch.tv/?video=v${video_id}&parent=localhost&t=${vod_offset}
  return (
      <Card className='hover:brightness-110'>
        <CardActionArea component='a' href={url} target='_blank'>
          <CardMedia component='img' alt={title} image={thumbnail_url} />
          <OverflowText
              className='px-2 text-base'
              title={title}
              style={{backgroundColor: 'rgba(0,0,0,0.45)', position: 'absolute', top: 0}}
              placement='top' />
          <p className='items-center bg-black bg-opacity-80 rounded-tl-md flex absolute bottom-0 text-base m-0 py-1 px-2 right-0 leading-none'>
            <UsersIcon className='opacity-90 mr-2 h-[14px]' />
            {view_count}
          </p>
        </CardActionArea>
      </Card>
  );
}
