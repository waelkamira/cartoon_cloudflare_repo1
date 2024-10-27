'use client';
import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import BackButton from '../../components/BackButton';
import Image from 'next/image';
import SideBarMenu from '../../components/SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import LoadingPhoto from '../../components/LoadingPhoto';
import SpacetoonSongs from '../../components/spacetoonSongs';
import HappyTagAd from '../../components/ads/happyTagAd';
import { ContactUs } from '../../components/sendEmail/sendEmail';
import VideoPlayer from '../../components/VideoPlayer';
import ExoclickOutStreamVideo from '../../components/ads/exoclickOutStreamVideo';
import ExoclickVideoSlider from '../../components/ads/exoclickVideoSlider';

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [spacetoonSong, setSpacetoonSong] = useState([]);
  // const { spacetoonSongName } = useContext(inputsContext);
  const [spacetoonSongName, setSpacetoonSongName] = useState('');

  // استخدام useEffect للتأكد من أن الكود يتم تشغيله فقط على العميل
  useEffect(() => {
    const handleUrlChange = () => {
      // تأكد من أن الكود يعمل على العميل فقط
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const spacetoonSongNameFromUrl = urlParams.get('spacetoonSongName');
        // console.log('spacetoonSongNameFromUrl', spacetoonSongNameFromUrl);
        if (
          spacetoonSongNameFromUrl &&
          spacetoonSongNameFromUrl !== spacetoonSongName
        ) {
          setSpacetoonSongName(spacetoonSongNameFromUrl);
        }
      }
    };

    handleUrlChange();
  }, [spacetoonSongName]); // إعادة التشغيل عند تغيير spacetoonSongName

  useEffect(() => {
    if (spacetoonSongName) {
      fetchSpacetoonSong();
    }
  }, [spacetoonSongName]);

  async function fetchSpacetoonSong() {
    const response = await fetch(
      `/api/spacetoonSongs?spacetoonSongName=${spacetoonSongName}`
    );
    const json = await response?.json();
    if (response.ok) {
      setSpacetoonSong(json);
    }
  }

  return (
    <div className="bg-one">
      <div className="relative w-full sm:p-4 lg:p-8 rounded-lg bg-one ">
        <div className="absolute flex flex-col items-start gap-2 z-40 top-2 right-2 sm:top-4 sm:right-4 xl:right-12 xl:top-12 ">
          <TfiMenuAlt
            className="p-1 rounded-lg text-3xl lg:text-5xl text-white cursor-pointer z-50  bg-two"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          />
          {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
        </div>

        <div className="relative w-full h-44 sm:h-[500px] overflow-hidden shadow-lg shadow-one">
          {spacetoonSong[0]?.spacetoonSongImage ? (
            <Image
              priority
              src={spacetoonSong[0]?.spacetoonSongImage}
              layout="fill"
              objectFit="cover"
              alt="photo"
            />
          ) : (
            <LoadingPhoto />
          )}
        </div>

        <div className="flex flex-col justify-start items-center w-full gap-4 my-4 px-2">
          {/* <BackButton /> */}
          <h1 className="grow text-sm lg:text-2xl w-full text-white">
            <span className="text-gray-500 ml-2">#</span>
            اسم الأغنية: <span>{spacetoonSong[0]?.spacetoonSongName}</span>
            {/* <HappyTagAd render={spacetoonSong[0]?.spacetoonSongName} /> */}
          </h1>
        </div>

        <div className="my-2 p-2">
          {spacetoonSong?.length === 0 && (
            <Loading myMessage={'😉لا يوجد نتائج لعرضها'} />
          )}
          <div className="flex gap-8 justify-center items-center w-full">
            {spacetoonSong?.length > 0 &&
              spacetoonSong?.map((item) => {
                return (
                  <div
                    className=" flex flex-col items-center justify-center rounded-lg overflow-hidden w-full"
                    key={item.spacetoonSongLink}
                  >
                    <ExoclickOutStreamVideo />

                    <VideoPlayer
                      videoUrl={item.spacetoonSongLink}
                      image={item?.spacetoonSongImage}
                      episodeName={item?.spacetoonSongName}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <ExoclickVideoSlider />
      <SpacetoonSongs vertical={true} title={false} image={false} />
      <div className="p-2">
        <ContactUs />
      </div>
    </div>
  );
}
