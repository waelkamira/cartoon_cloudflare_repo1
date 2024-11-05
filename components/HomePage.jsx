'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
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
import MonetagExcitedTag from './ads/MonetagExcitedTag';
import MonetagInPagePush from './ads/MonetagInPagePush';
import AdsterraNativeBanner from './ads/adsterraNativeBanner';
import AdsterraBanner from './ads/adsterraBanner';
import AdsterraBanner468x60 from './ads/adsterraBanner468x60';
import AdsterraPopunderFor from './ads/adsterraPopunderFor';
import ExoclickBanner from './ads/exoclickBanner';
import ExoclickOutStreamVideo from './ads/exoclickOutStreamVideo';
import ExoclickVideoSlider from './ads/exoclickVideoSlider';
import ExoClickAd from './ads/exoclickAd';
import ExoclickNative from './ads/exoclickNative';
import ExoclickInStreamVideoAd from './ads/exoclickInStreamVideoAd';
import JuicyAdsAd from './ads/JuicyAdsAd';
import JuicyAdsAdVideo from './ads/JuicyAdsAdVideo';
import JuicyAdsImage from './ads/JuicyAdsImage';
import HillTopAdsVideo from './ads/HillTopAdsVideo';
import HillTopAdsVideoSlider from './ads/HillTopAdsVideoSlider';
import HillTopAdsMultiTagBanner from './ads/HillTopAdsMultiTagBanner';
import HillTopAdsMultiTagBannerMobile from './ads/HillTopAdsMultiTagBannerMobile';
export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpacetoonOpen, setIsSpacetoonOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [display, setDisplay] = useState(false);
  const [active, setActive] = useState(false);
  const session = useSession();

  const user = CurrentUser();
  // console.log('user', user);
  useEffect(() => {
    sessionStorage.clear(); // تفريغ جميع العناصر في sessionStorage
    localStorage.removeItem('episodeNumber');
  }, []);

  return (
    <>
      <div className="relative">
        {/* <div className="absolute top-0 z-10">
          <ExoclickOutStreamVideo />
          <ExoclickVideoSlider />
          <ExoclickBanner />
          <ExoClickAd />
          <ExoclickNative />
          <AdsterraBanner />
          <AdsterraNativeBanner />
          <AdsterraBanner468x60 />
          <HillTopAdsMultiTagBannerMobile />
          <HillTopAdsMultiTagBanner />
          <JuicyAdsAd />
          <JuicyAdsAdVideo />
          <JuicyAdsImage />

        
        </div> */}
      </div>
      <SharePrompt />
      <div className="relative flex flex-col justify-center items-center xl:w-4/5 z-50 sm:my-0 w-full bg-one">
        <div className=" w-full ">
          <div className="fixed top-0 right-0 z-50 flex items-center justify-center mb-2 gap-2 w-full text-white bg-one p-2">
            <TfiMenuAlt
              className="sm:hidden p-2 rounded-lg text-5xl text-white hover:scale-101 "
              onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
            <div className="relative w-24 h-14 sm:h-16 sm:w-20 md:h-20 md:w-24 lg:h-24 lg:w-28 shadow-lg shadow-one">
              <Image
                priority
                src={'https://i.imgur.com/nfDVITC.png'}
                layout="fill"
                objectFit="cover"
                alt="photo"
              />
            </div>
            <SearchBar />
          </div>
          <CategoriesSlides />

          <div className={'p-4'}>
            {user?.isAdmin && (
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
            )}

            <SeriesForm setIsVisible={setIsVisible} isVisible={isVisible} />
            <EpisodForm setShow={setShow} show={show} />
            <MovieForm setDisplay={setDisplay} display={display} />
            <SongForm setActive={setActive} active={active} />
            <SpacetoonSongForm
              setIsSpacetoonOpen={setIsSpacetoonOpen}
              isSpacetoonOpen={isSpacetoonOpen}
            />
            {/* انتبه يتم تفعيل هذا الخيار فقط عندما نريد اضافة مسلسل او فيلم او حلقة .. الخ وليس متاح للمستخدمين */}
            {/* {session?.status === 'unauthenticated' && (
              <Button title={'تسجيل الدخول'} path={'/login'} style={' '} />
            )} */}
            {/* {session?.status === 'authenticated' && (
              <Button
                title={'تسجيل الخروج'}
                path={'/'}
                onClick={() => signOut()}
              />
            )} */}
          </div>
        </div>
        <div className=" flex flex-col justify-center items-center w-full rounded-lg sm:p-8 gap-2 ">
          <Serieses />
        </div>
      </div>
    </>
  );
}
