import {
  AppBar,
  Toolbar,
  Typography
} from "@mui/material";
import acorn from './acorn.png';
import Image from 'next/image';
import React, {type PropsWithChildren} from "react";
import {FaDiscord, FaGithub, FaTiktok, FaTwitch, FaTwitter, FaYoutube} from "react-icons/fa";

export function Navbar() {
  return (
      <AppBar position='static'>
        <Toolbar>
          <h1 className='flex gap-4 text-lg font-medium'>
            <Image src={acorn} alt='acorn avatar' height={32} width={32} /> Acorn1010
          </h1>
          <Links />
        </Toolbar>
      </AppBar>
  );
}

function Links() {
  const iconClass = 'text-2xl md:text-3xl';
  return (
      <div className='flex gap-4 grow justify-center'>
        <SocialLink to='https://www.twitch.tv/acorn1010'><FaTwitch className={iconClass} /></SocialLink>
        <SocialLink to='https://www.tiktok.com/@theacorn10'><FaTiktok className={iconClass} /></SocialLink>
        <SocialLink to='https://twitter.com/theacorn1010'><FaTwitter className={iconClass} /></SocialLink>
        <SocialLink to='https://github.com/acorn1010'><FaGithub className={iconClass} /></SocialLink>
        <SocialLink to='https://www.youtube.com/@Acorn10'><FaYoutube className={iconClass} /></SocialLink>
        <SocialLink to='https://discord.gg/fwvzUh5TV3'><FaDiscord className={iconClass} /></SocialLink>
      </div>
  );
}

function SocialLink({children, to}: PropsWithChildren<{to: string}>) {
  return <a href={to} className='flex items-center text-zinc-400 hover:text-white' target='_blank' rel='noreferrer'>{children}</a>;
}
