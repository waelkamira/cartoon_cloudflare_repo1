'use client';
import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import BackButton from '../../components/BackButton';
import Image from 'next/image';
import SideBarMenu from '../../components/SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import LoadingPhoto from '../../components/LoadingPhoto';
import SpacetoonSongs from '../../components/spacetoonSongs';
import { ContactUs } from '../../components/sendEmail/sendEmail';
import VideoPlayer from '../../components/VideoPlayer';
import { useSession } from 'next-auth/react';
import SubscriptionPage from '../../components/paypal/subscriptionPage';
import CurrentUser from '../../components/CurrentUser';

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [spacetoonSong, setSpacetoonSong] = useState([]);
  const [spacetoonSongId, setSpacetoonSongId] = useState('');
  const session = useSession();
  const user = CurrentUser();
  // استخدام useEffect للتأكد من أن الكود يتم تشغيله فقط على العميل
  useEffect(() => {
    const handleUrlChange = () => {
      // تأكد من أن الكود يعمل على العميل فقط
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const spacetoonSongIdFromUrl = urlParams.get('spacetoonSongId');
        // console.log('spacetoonSongIdFromUrl', spacetoonSongIdFromUrl);
        if (
          spacetoonSongIdFromUrl &&
          spacetoonSongIdFromUrl !== spacetoonSongId
        ) {
          setSpacetoonSongId(spacetoonSongIdFromUrl);
        }
      }
    };

    handleUrlChange();
  }, [spacetoonSongId]); // إعادة التشغيل عند تغيير spacetoonSongId

  useEffect(() => {
    if (spacetoonSongId) {
      fetchSpacetoonSong();
    }
  }, [spacetoonSongId]);

  async function fetchSpacetoonSong() {
    const response = await fetch(
      `/api/spacetoonSongs?spacetoonSongId=${spacetoonSongId}`
    );
    const json = await response?.json();
    if (response.ok) {
      setSpacetoonSong(json);
    }
  }

  return (
    <>
      {session?.status === 'authenticated' &&
        user?.monthly_subscribed === false &&
        user?.yearly_subscribed === false && <SubscriptionPage />}

      <div className="bg-one sm:mt-24">
        <div className="relative w-full sm:p-4 lg:p-8 rounded-lg bg-one ">
          <div className="absolute flex flex-col items-start gap-2 z-30 top-2 right-2 sm:top-4 sm:right-4 xl:right-12 xl:top-12 ">
            {/* <TfiMenuAlt
              className="p-1 rounded-lg text-3xl lg:text-5xl text-white cursor-pointer z-50  bg-two"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            />
            {isOpen && <SideBarMenu setIsOpen={setIsOpen} />} */}
          </div>

          <div className="relative w-full h-44 sm:h-[500px] overflow-hidden shadow-lg shadow-one">
            {spacetoonSong[0]?.spacetoonSongImage ? (
              <Image
                loading="lazy"
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
                      <VideoPlayer
                        videoUrl={item.spacetoonSongLink}
                        image={item?.spacetoonSongImage}
                        episodeName={item?.spacetoonSongId}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        <SpacetoonSongs vertical={false} title={false} image={false} />
        <div className="p-2">
          <ContactUs />
        </div>
      </div>
    </>
  );
}
