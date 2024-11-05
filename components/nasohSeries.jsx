'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useRouter } from 'next/navigation';
import Loading from './Loading';
import Image from 'next/image';
import MonetagExcitedTag from './ads/MonetagExcitedTag';

export default function NasohSeries({ vertical = false }) {
  const [episodes, setEpisodes] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMoreEpisodes, setHasMoreEpisodes] = useState(true);
  const router = useRouter();

  // إعداد الـ Slider باستخدام KeenSlider
  const [nasohSliderRef, nasohInstanceRef] = useKeenSlider({
    loop: false,
    mode: 'free',
    vertical: vertical ? true : false,
    rtl: vertical ? false : true,
    slides: {
      perView: 2,
      spacing: () => {
        if (typeof window !== 'undefined') {
          return window.innerWidth < 768 ? 3 : 17;
        }
        return 17;
      },
    },
    slideChanged(slider) {
      const currentSlide = slider.track.details.rel;
      const totalSlides = slider.track.details.slides.length;

      // جلب المزيد من الحلقات عند الاقتراب من آخر شريحة
      if (currentSlide >= totalSlides - 2) {
        setPageNumber((prevPage) => prevPage + 1);
      }
    },
  });

  // تحديث الـ Slider عند تغيير الحلقات
  useEffect(() => {
    if (nasohInstanceRef.current) {
      nasohInstanceRef.current.update();
    }
  }, [episodes]);

  // جلب الحلقات عند تغيير الصفحة
  useEffect(() => {
    fetchEpisodes();
  }, [pageNumber]);

  const fetchEpisodes = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/nasohSeries?seriesName='عائلة نصوح'&limit=4&page=${pageNumber}`
      );
      if (response.ok) {
        const json = await response.json();
        if (json.length === 0) {
          setHasMoreEpisodes(false);
        } else {
          // تجنب تكرار الحلقات عند الإضافة
          const existingIds = new Set(episodes.map((ep) => ep.id));
          const newEpisodes = json.filter((ep) => !existingIds.has(ep.id));

          if (newEpisodes.length > 0) {
            setEpisodes((prevEpisodes) => [...prevEpisodes, ...newEpisodes]);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching episodes:', error);
    }
  }, [pageNumber, episodes]);

  return (
    <div className="flex flex-col items-center justify-center w-full overflow-x-hidden p-2 bg-one z-50">
      <MonetagExcitedTag />
      <div className="relative h-44 w-full sm:h-[600px] ">
        <Image
          src={'https://i.imgur.com/u6grI22.png'}
          layout="fill"
          objectFit="cover"
          alt={'نصوح'}
        />{' '}
      </div>
      <h1 className="w-full text-start p-2 text-white">عائلة نصوح</h1>
      <div
        ref={nasohSliderRef}
        className={
          (vertical ? 'h-[600px]' : 'h-fit') +
          ' keen-slider  py-2 shadow-lg  overflow-scroll rounded-md'
        }
      >
        {episodes.length === 0 ? (
          <Loading />
        ) : (
          episodes?.map((episode) => (
            <div
              key={episode.id}
              className="keen-slider__slide snap-center flex flex-col items-center"
            >
              <div
                className=" flex flex-col items-center justify-start flex-shrink-0 w-full h-full mr-1"
                key={episode?.id}
                onClick={() => {
                  router.push(`/episodes?episodeName=${episode?.episodeName}`);
                }}
              >
                <div
                  className={
                    (vertical ? 'w-72 h-44' : 'w-40 h-[90px]') +
                    ' relative w-24 h-32 sm:w-full sm:h-64 rounded-md overflow-hidden hover:cursor-pointer'
                  }
                >
                  <Image
                    src={episode?.episodeImage}
                    layout="fill"
                    objectFit="cover"
                    objectPosition="top" // يحدد موضع الصورة من الأعلى
                    alt={episode?.episodeName}
                  />
                </div>
                <h1 className="text-white text-center m-2 text-[10px] sm:text-[15px] w-full line-clamp-2 font-bold">
                  {episode?.episodeName}
                </h1>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
