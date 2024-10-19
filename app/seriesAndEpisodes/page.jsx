'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import VideoPlayer from '../../components/VideoPlayer';
import Loading from '../../components/Loading';
import BackButton from '../../components/BackButton';
import SideBarMenu from '../../components/SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import LoadingPhoto from '../../components/LoadingPhoto';
import Image from 'next/image';
import { ContactUs } from '../../components/sendEmail/sendEmail';
import HappyTagAd from '../../components/ads/happyTagAd';
import AdsterraNativeBanner from '../../components/ads/adsterraNativeBanner';
import AdsterraBanner from '../../components/ads/adsterraBanner';
import AdsterraPopunderFor from '../../components/ads/adsterraPopunderFor';
import ExoclickBanner from '../../components/ads/exoclickBanner';
import ExoclickOutStreamVideo from '../../components/ads/exoclickOutStreamVideo';
import ExoclickVideoSlider from '../../components/ads/exoclickVideoSlider';

export default function SeriesAndEpisodes() {
  const [episodes, setEpisodes] = useState([]);
  const [episodeNumber, setEpisodeNumber] = useState(1); // حالة للتحكم برقم الحلقة
  const [isLoading, setIsLoading] = useState(false);
  const [seriesName, setSeriesName] = useState('');
  const [series, setSeries] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [hasMoreEpisodes, setHasMoreEpisodes] = useState(true);
  const [isTrue, setIsTrue] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const seriesNameParam = params.get('seriesName');
    if (seriesNameParam) {
      fetchSeries(seriesNameParam);
    }
    setSeriesName(seriesNameParam);
  }, []);

  useEffect(() => {
    if (seriesName && hasMoreEpisodes) {
      fetchEpisode();
    }
  }, [seriesName, episodeNumber]);

  const fetchEpisode = useCallback(async () => {
    setIsLoading(true);
    try {
      const episodeName = `${seriesName} الحلقة ${episodeNumber}`;
      const response = await fetch(
        `/api/showSeries?seriesName=${seriesName}&episodeName=${encodeURIComponent(
          episodeName
        )}`
      );
      if (response.ok) {
        const json = await response.json();
        // console.log('json', json);

        if (json.length > 0) {
          setEpisodes([json[0]]); // تغيير لجلب حلقة واحدة بدلاً من تكديس الحلقات
          const nextEpisodeName = `${seriesName} الحلقة ${episodeNumber + 1}`;
          const nextResponse = await fetch(
            `/api/showSeries?seriesName=${seriesName}&episodeName=${encodeURIComponent(
              nextEpisodeName
            )}`
          );
          if (!nextResponse.ok || (await nextResponse.json()).length === 0) {
            setHasMoreEpisodes(false);
          }
        } else {
          setHasMoreEpisodes(false);
        }
      }
    } catch (error) {
      console.error('Error fetching episode:', error);
    } finally {
      setIsLoading(false);
    }
  }, [seriesName, episodeNumber]);

  async function fetchSeries(seriesName) {
    const response = await fetch(`/api/serieses?seriesName=${seriesName}`);
    const json = await response?.json();
    // console.log('fetchSeries', json);
    if (response.ok) {
      setSeries(json[0]);
    }
  }

  // عند تحميل الصفحة، استرجاع رقم الحلقة من localStorage أو استخدام 1 إذا لم يكن موجوداً
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const seriesNameParam = params.get('seriesName');
    const savedEpisodeNumber = localStorage.getItem('episodeNumber'); // استرجاع رقم الحلقة المحفوظ
    if (seriesNameParam) {
      fetchSeries(seriesNameParam);
      setSeriesName(seriesNameParam);
      setEpisodeNumber(savedEpisodeNumber ? parseInt(savedEpisodeNumber) : 1); // استخدام الحلقة المحفوظة أو البدء من 1
    }
  }, []);

  const handleNextEpisode = () => {
    const nextEpisodeNumber = episodeNumber + 1;
    setEpisodeNumber(nextEpisodeNumber);
    localStorage.setItem('episodeNumber', nextEpisodeNumber); // حفظ رقم الحلقة الجديد في localStorage
    window.location.reload(); // إعادة تحميل الصفحة
  };

  const handlePreviousEpisode = () => {
    if (episodeNumber > 1) {
      const prevEpisodeNumber = episodeNumber - 1;
      setEpisodeNumber(prevEpisodeNumber);
      localStorage.setItem('episodeNumber', prevEpisodeNumber); // حفظ رقم الحلقة الجديد في localStorage
      window.location.reload(); // إعادة تحميل الصفحة
    }
  };

  return (
    <div className="relative w-full h-[1000px] sm:p-4 lg:p-8 rounded-lg bg-one overflow-y-auto">
      <div className="absolute flex flex-col items-start gap-2 z-40 top-2 right-2 sm:top-4 sm:right-4 xl:right-12 xl:top-12">
        <TfiMenuAlt
          className="p-1 rounded-lg text-3xl lg:text-5xl text-white cursor-pointer z-50  bg-two"
          onClick={() => setIsOpen(!isOpen)}
        />
        {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
      </div>
      <div className="hidden lg:block">{/* <FantasticTagAntiAdBlock /> */}</div>
      <div className="relative w-full">
        <div className="relative w-full h-44 sm:h-[500px] overflow-hidden shadow-lg ">
          {series?.seriesImage ? (
            <Image
              priority
              src={series?.seriesImage}
              layout="fill"
              objectFit="cover"
              alt="photo"
            />
          ) : (
            <LoadingPhoto />
          )}
        </div>
        <div className="absolute w-full h-44 sm:h-[500px] overflow-hidden shadow-lg top-0">
          {series?.seriesImage ? (
            <Image
              priority
              src={series?.seriesImage}
              layout="fill"
              objectFit="contain"
              alt="photo"
            />
          ) : (
            <LoadingPhoto />
          )}
        </div>
      </div>
      <div className="flex flex-col justify-start items-center w-full gap-4 my-8">
        <div
          onClick={
            () => {
              localStorage.removeItem('episodeNumber');
              setIsTrue(false);
            } // حفظ رقم الحلقة الجديد في localStorage
          }
        >
          <BackButton />
        </div>

        <h1 className="grow text-lg lg:text-2xl w-full text-white">
          <span className="text-gray-500 ml-2">#</span>
          اسم المسلسل <span>{seriesName}</span>
        </h1>
      </div>
      {/* أزرار التنقل بين الحلقات */}
      <div className="flex justify-between w-full p-4 items-start">
        <button
          onClick={handleNextEpisode}
          className="btn p-1 sm:px-4 sm:py-2 shadow-lg text-white rounded-lg disabled:opacity-50"
          disabled={!hasMoreEpisodes} // تعطيل زر الحلقة التالية إذا لم تكن هناك حلقات
        >
          الحلقة التالية
        </button>
        <button
          onClick={handlePreviousEpisode}
          className="btn p-1 sm:px-4 sm:py-2 shadow-lg text-white rounded-lg disabled:opacity-50"
          disabled={episodeNumber === 1} // تعطيل زر الحلقة السابقة إذا كانت الحلقة الأولى
        >
          الحلقة السابقة
        </button>
      </div>
      <div className="my-2 p-2">
        {episodes.length === 0 && !isLoading && (
          <Loading myMessage={'😉لا يوجد نتائج لعرضها'} />
        )}

        <div>
          {episodes.map((episode) => (
            <div
              key={episode.id}
              className="flex flex-col items-center justify-start rounded-lg overflow-hidden "
            >
              <div className={'w-full'}>
                <h1 className="text-white text-center p-2">
                  {episode?.episodeName}
                  <HappyTagAd render={episode?.episodeName} />
                </h1>

                <VideoPlayer
                  videoUrl={episode?.episodeLink}
                  image={series?.seriesImage}
                  episodeName={episode?.episodeName}
                  showAd={isTrue}
                  onNextEpisode={handleNextEpisode} // تمرير دالة الانتقال للحلقة التالية
                />
                <ContactUs />
                <ExoclickOutStreamVideo />
                <ExoclickVideoSlider />
                {/* <ExoclickBanner /> */}
                {/* <AdsterraNativeBanner /> */}
                {/* <AdsterraBanner /> */}
                {/* <AdsterraPopunderFor /> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
