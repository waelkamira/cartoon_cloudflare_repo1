'use client';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useContext, use } from 'react';
import { inputsContext } from './Context';
import Image from 'next/image';
import Loading from './Loading';
import CurrentUser from './CurrentUser';

export default function SportPlanetMostViewed() {
  const [pageNumber, setPageNumber] = useState(1);
  const [sportMostViewed, setSportMostViewed] = useState([]);
  const { newSeries, deletedSeries } = useContext(inputsContext);
  const router = useRouter();
  const user = CurrentUser();
  // console.log('user', user);

  const [sportMostViewedSliderRef, sportMostViewedInstanceRef] = useKeenSlider({
    loop: false,
    mode: 'free',
    rtl: true,
    slides: {
      perView: 3,
      spacing: 5,
    },
    slideChanged(slider) {
      const currentSlide = slider.track.details.rel;
      const totalSlides = slider.track.details.slides.length;

      // جلب المزيد من المسلسلات عند الوصول إلى الشريحة الأخيرة
      if (currentSlide >= totalSlides - 3) {
        setPageNumber((prevPage) => prevPage + 1);
      }
    },
  });

  useEffect(() => {
    fetchSportMostViewed();
  }, [newSeries, deletedSeries, pageNumber]);

  useEffect(() => {
    if (sportMostViewedInstanceRef.current) {
      sportMostViewedInstanceRef.current.update();
    }
  }, [sportMostViewed]);

  async function fetchSportMostViewed() {
    try {
      const response = await fetch(
        `/api/serieses?page=${pageNumber}&planetName=رياضة&limit=4&&mostViewed=${true}`
      );
      const json = await response?.json();
      if (response.ok) {
        // console.log('json', json);
        const existingIds = new Set(sportMostViewed.map((series) => series.id));
        const newSportMostViewed = json.filter(
          (series) => !existingIds.has(series.id)
        );

        if (newSportMostViewed.length > 0) {
          setSportMostViewed((prevSportMostViewed) => [
            ...prevSportMostViewed,
            ...newSportMostViewed,
          ]);
        }
      }
    } catch (error) {
      console.error('Error fetching sport:', error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full overflow-x-hidden p-2 ">
      <h1 className="w-full text-start p-2 text-white">الأكثر مشاهدة</h1>

      <div ref={sportMostViewedSliderRef} className="keen-slider shadow-lg">
        {sportMostViewed?.length === 0 ? (
          <Loading />
        ) : (
          // إنقاص أول 4 مسلسلات من العرض
          sportMostViewed?.map((series) => (
            <div
              key={series.id}
              className="keen-slider__slide snap-center flex flex-col items-center"
            >
              <div
                className=" flex flex-col items-center justify-start flex-shrink-0 px-2 w-full"
                key={series.id}
                onClick={() => {
                  router.push(
                    `/seriesAndEpisodes?seriesName=${series?.seriesName}`
                  );
                }}
              >
                <div className="relative w-24 h-32 sm:w-full sm:h-64 rounded-md overflow-hidden mx-2 hover:cursor-pointer">
                  <Image
                    src={series.seriesImage}
                    layout="fill"
                    objectFit="cover"
                    objectPosition="top" // يحدد موضع الصورة من الأعلى
                    alt={series.seriesName}
                  />
                </div>
                <h1 className="text-white text-center m-2 text-[10px] sm:text-[15px] w-full line-clamp-2 font-bold">
                  {series.seriesName}
                </h1>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
