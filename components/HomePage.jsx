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

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpacetoonOpen, setIsSpacetoonOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [display, setDisplay] = useState(false);
  const [active, setActive] = useState(false);
  const session = useSession();
  const user = CurrentUser();
  const [open, setOpen] = useState(false);
  const { dispatch } = useContext(inputsContext);

  // console.log('user', user);
  // console.log('session', session);
  useEffect(() => {
    sessionStorage.clear(); // تفريغ جميع العناصر في sessionStorage
    localStorage.removeItem('episodeNumber');
  }, []);

  return (
    <>
      {user &&
        session?.status === 'authenticated' &&
        user?.monthly_subscribed === false &&
        user?.yearly_subscribed === false && <SubscriptionPage />}{' '}
      {session?.status === 'unauthenticated' && (
        <div
          className="absolute right-0 top-0 h-full w-full z-50"
          onClick={() => setOpen(true)}
        >
          {open ? <LoginMessage setOpen={setOpen} /> : ''}
        </div>
      )}
      <div className="relative flex flex-col justify-center items-center xl:w-4/5 z-40 sm:my-0 w-full bg-one">
        <div className=" w-full ">
          {/* <div className="fixed top-0 right-0 z-30 flex items-center justify-center mb-2 gap-2 w-full text-white bg-one p-2">
            <TfiMenuAlt
              className="xl:hidden p-2 rounded-lg text-5xl text-white hover:scale-101 "
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
            <div className="hidden xl:block">
              <SideBarMenu setIsOpen={setIsOpen} />
            </div>
            <SearchBar />
          </div> */}
          <CategoriesSlides />

          <div className={'p-4'}>
            {user?.isAdmin ? (
              <>
                <Button title={'انشاء حلقة'} onClick={() => setShow(!show)} />
                <Button
                  title={'انشاء مسلسل'}
                  onClick={() => setIsVisible(!isVisible)}
                />
                <Button
                  title={'انشاء أغنية سبيس تون'}
                  onClick={() => setIsSpacetoonOpen(!isSpacetoonOpen)}
                />
                <Button
                  title={'انشاء فيلم'}
                  onClick={() => setDisplay(!display)}
                />
                <Button
                  title={'انشاء أغنية'}
                  onClick={() => setActive(!active)}
                />
              </>
            ) : (
              ''
            )}
            <SeriesForm setIsVisible={setIsVisible} isVisible={isVisible} />
            <EpisodForm setShow={setShow} show={show} />
            <MovieForm setDisplay={setDisplay} display={display} />
            <SongForm setActive={setActive} active={active} />
            <SpacetoonSongForm
              setIsSpacetoonOpen={setIsSpacetoonOpen}
              isSpacetoonOpen={isSpacetoonOpen}
            />

            {session?.status === 'unauthenticated' && (
              <Button title={'تسجيل الدخول'} path={'/login'} style={' '} />
            )}
          </div>
        </div>
        <div className=" flex flex-col justify-center items-center w-full rounded-lg sm:p-8 gap-2 ">
          <Serieses />
        </div>
      </div>
    </>
  );
}
