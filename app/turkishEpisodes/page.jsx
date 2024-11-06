'use client';
import React, { useState, useEffect, useCallback } from 'react';
import VideoPlayer from '../../components/VideoPlayer';
import Loading from '../../components/Loading';
import SideBarMenu from '../../components/SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import LoadingPhoto from '../../components/LoadingPhoto';
import Image from 'next/image';
import TurkishCartoon from '../../components/turkishCartoon';

export default function Page() {
  const [episodes, setEpisodes] = useState([]);
  const [episodeNumber, setEpisodeNumber] = useState(1); // التحكم برقم الحلقة
  const [isLoading, setIsLoading] = useState(false);
  const [episodeName, setEpisodeName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // استخدام URL parameters لجلب اسم الحلقة
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const episodeNameParam = params.get('episodeName');
    if (episodeNameParam) {
      console.log('episodeNameParam', episodeNameParam);

      setEpisodeName(episodeNameParam);
      fetchEpisode(episodeNameParam);
    }
  }, []);

  // جلب الحلقة بناءً على الرقم واسم المسلسل
  const fetchEpisode = useCallback(
    async (episodeName) => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/turkishEpisodes?episodeName=${episodeName}`
        );

        const json = await response.json();

        // التحقق من نجاح الاستجابة
        if (response.ok) {
          if (json.length > 0) {
            setEpisodes([json[0]]);
          }
        }
      } catch (error) {
        // إذا حدث خطأ أثناء جلب البيانات، يتم طباعة الخطأ في الكونسول
        console.error('Error fetching episode:', error);
      } finally {
        // في النهاية، يتم تعيين حالة التحميل إلى false لإخفاء مؤشر التحميل
        setIsLoading(false);
      }
    },
    [episodeNumber]
  );

  return (
    <div
      className="relative w-full sm:p-4 lg:p-8 bg-one h-[1000px]
overflow-y-auto"
    >
      <div className="absolute flex flex-col items-start gap-2 z-40 top-2 right-2 sm:top-4 sm:right-4 xl:right-12 xl:top-12">
        <TfiMenuAlt
          className="p-1 rounded-lg text-3xl lg:text-5xl text-white cursor-pointer z-50 bg-two"
          onClick={() => setIsOpen(!isOpen)}
        />
        {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
      </div>
      <div className="hidden lg:block"></div>
      <div className="relative w-full">
        <div className="relative w-full h-44 sm:h-[500px] overflow-hidden shadow-lg">
          {episodes.length > 0 ? (
            <Image
              priority
              src={episodes[0]?.episodeImage}
              layout="fill"
              objectFit="cover"
              alt="photo"
              objectPosition="top"
            />
          ) : (
            <LoadingPhoto />
          )}
        </div>
      </div>
      <div className="flex flex-col justify-start items-center w-full gap-4 my-8">
        <div
          onClick={() => {
            localStorage.removeItem('episodeNumber');
          }}
        >
          {/* <BackButton /> */}
        </div>

        <h1 className="grow text-lg lg:text-2xl w-full text-white">
          <span className="text-gray-500 mx-2">#</span>
          <span className="">{episodes[0]?.seriesName}</span>
        </h1>
      </div>
      <div className="my-2 p-2">
        {episodes.length === 0 && !isLoading && (
          <Loading myMessage={'😉 لا يوجد نتائج لعرضها'} />
        )}
        {episodes.length > 0 && (
          <div>
            {episodes.map((episode) => {
              return (
                <div
                  key={episode.id}
                  className="flex flex-col items-center justify-start  overflow-hidden"
                >
                  <div className={'w-full'}>
                    <h1 className="text-white text-center p-2">
                      {episode?.episodeName}
                    </h1>
                    <VideoPlayer
                      videoUrl={episode?.episodeLink}
                      image={episode?.episodeImage}
                      episodeName={episode?.episodeName}
                    />
                  </div>
                  {/* <ExoclickVideoSlider /> */}

                  <TurkishCartoon vertical={true} image={false} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
