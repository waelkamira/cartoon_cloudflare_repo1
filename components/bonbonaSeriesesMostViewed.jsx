'use client';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useContext, use } from 'react';
import { inputsContext } from './Context';
import Image from 'next/image';
import Loading from './Loading';
import CurrentUser from './CurrentUser';

export default function BonbonaPlanetMostViewed() {
  const [pageNumber, setPageNumber] = useState(1);
  const [bonbonaMostViewed, setBonbonaMostViewed] = useState([]);
  const { newSeries, deletedSeries } = useContext(inputsContext);
  const router = useRouter();
  const user = CurrentUser();
  // console.log('user', user);

  const [bonbonaMostViewedSliderRef, bonbonaMostViewedInstanceRef] =
    useKeenSlider({
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
    fetchBonbonaMostViewed();
  }, [newSeries, deletedSeries, pageNumber]);

  useEffect(() => {
    if (bonbonaMostViewedInstanceRef.current) {
      bonbonaMostViewedInstanceRef.current.update();
    }
  }, [bonbonaMostViewed]);

  async function fetchBonbonaMostViewed() {
    try {
      const response = await fetch(
        `/api/serieses?page=${pageNumber}&planetName=الصيصان&limit=4&&mostViewed=${true}`
      );
      const json = await response?.json();
      if (response.ok) {
        // console.log('json', json);
        const existingIds = new Set(
          bonbonaMostViewed.map((series) => series.id)
        );
        const newBonbonaMostViewed = json.filter(
          (series) => !existingIds.has(series.id)
        );

        if (newBonbonaMostViewed.length > 0) {
          setBonbonaMostViewed((prevBonbonaMostViewed) => [
            ...prevBonbonaMostViewed,
            ...newBonbonaMostViewed,
          ]);
        }
      }
    } catch (error) {
      console.error('Error fetching bonbona:', error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full overflow-x-hidden p-2 ">
      <h1 className="w-full text-start p-2 text-white">الأكثر مشاهدة</h1>

      <div ref={bonbonaMostViewedSliderRef} className="keen-slider  shadow-lg">
        {bonbonaMostViewed?.length === 0 ? (
          <Loading />
        ) : (
          // إنقاص أول 4 مسلسلات من العرض
          bonbonaMostViewed?.map((series) => (
            <div
              key={series.id}
              className="keen-slider__slide snap-center flex flex-col items-center"
            >
              <div
                className=" flex flex-col items-center justify-start flex-shrink-0 px-2 w-full"
                key={series.id}
                onClick={() => {
                  // التنقل إلى الرابط الجديد
                  router.push(
                    `/seriesAndEpisodes?seriesName=${series?.seriesName}`
                  );
                }}
              >
                <div className="relative w-24 h-32 sm:w-full sm:h-64 rounded-md overflow-hidden hover:cursor-pointer">
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
