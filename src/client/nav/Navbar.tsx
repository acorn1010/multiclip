import {
  AppBar,
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from "@mui/material";
import {signIn, signOut, useSession} from "next-auth/react";
import {useState} from "react";

export function Navbar() {
  return (
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' sx={{flexGrow: 1}}>Multiclip</Typography>
          <LoginButton />
        </Toolbar>
      </AppBar>
  );
}

function LoginButton() {
  const {data} = useSession();

  // Logged in
  if (data?.user) {
    const {name, image} = data.user;
    return <LoginAvatarButton name={name ?? undefined} image={image ?? undefined} />;
  }

  // Not logged in
  return <Button className='hover:bg-lighten' onClick={() => signIn()}>Login</Button>;
}

/** Avatar button that shows when a user is logged in. */
function LoginAvatarButton(props: {name: string | undefined, image: string | undefined}) {
  const {name, image} = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const close = () => setAnchorEl(null);
  return (
      <>
        <IconButton size='medium' onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Avatar src={image ?? undefined} alt={`${name}'s avatar`} />
        </IconButton>
        <Menu anchorEl={anchorEl} keepMounted onClose={close} open={!!anchorEl}>
          <MenuItem onClick={() => {
            close();
            signOut().then(() => {});
          }}>Log Out</MenuItem>
        </Menu>
      </>
  );
}
