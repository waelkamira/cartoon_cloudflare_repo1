'use client';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import { signOut, useSession } from 'next-auth/react';
import SideBarMenu from './SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import CategoriesSlides from './CategoriesSlides';
import Button from './Button';
import CurrentUser from './CurrentUser';
import Serieses from './serieses';
import SeriesForm from './createSeries';
import EpisodForm from './createEpisode';
import MovieForm from './createMovie';
import SongForm from './createSong';
import SpacetoonSongForm from './createSpacetoonSong';
import SharePrompt from './SharePromptOnWhatsup';
import LoginMessage from './loginMessage';
import SubscriptionPage from './paypal/subscriptionPage';
import { inputsContext } from './Context';

export default function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpacetoonOpen, setIsSpacetoonOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [display, setDisplay] = useState(false);
  const [active, setActive] = useState(false);
  const session = useSession();
  const user = CurrentUser();
  const [open, setOpen] = useState(true);
  return (
    <div>
      {' '}
      <div className="absolute w-full z-50">
        {/* {open && session?.status === 'unauthenticated' && (
          <div
            className="fixed right-0 h-screen w-full z-40"
            onClick={() => setOpen(true)}
          >
            {open ? <LoginMessage setOpen={setOpen} /> : ''}
          </div>
        )} */}
        <div className="fixed top-0 right-0 z-30 flex items-center justify-center mb-2 gap-2 w-full text-white bg-one p-2">
          <TfiMenuAlt
            className=" p-2 rounded-lg text-5xl text-white hover:scale-101 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
          {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
          <div className="relative w-24 h-14 sm:h-16 sm:w-20 md:h-20 md:w-24 lg:h-24 lg:w-28 shadow-lg shadow-one">
            <Image
              loading="lazy"
              src={'https://i.imgur.com/nfDVITC.png'}
              layout="fill"
              objectFit="cover"
              alt="photo"
            />
          </div>
          {/* <div className="hidden 2xl:block">
            <SideBarMenu setIsOpen={setIsOpen} />
          </div> */}
          <SearchBar />
        </div>
      </div>
    </div>
  );
}
