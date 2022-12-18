import {signIn, signOut, useSession} from "next-auth/react";
import {Avatar, Button, IconButton, Menu, MenuItem} from "@mui/material";
import {useState} from "react";

export function LoginButton() {
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
