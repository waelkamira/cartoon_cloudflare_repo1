'use client';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useContext } from 'react';
import { inputsContext } from './Context';
import Image from 'next/image';
import Loading from './Loading';
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from 'react-icons/md';

export default function NewSerieses() {
  const [pageNumber, setPageNumber] = useState(1);
  const [serieses, setSerieses] = useState([]);
  const { newSeries, deletedSeries } = useContext(inputsContext);
  const router = useRouter();
  const [showMessage, setShowMessage] = useState(true);

  const [seriesesSliderRef, seriesesInstanceRef] = useKeenSlider({
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

      // Fetch more series when reaching the last slide
      if (currentSlide >= totalSlides - 3) {
        setPageNumber((prevPage) => prevPage + 1);
      }
    },
  });

  useEffect(() => {
    fetchSerieses();
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 10000);

    // Cleanup timer if the component is unmounted
    return () => clearTimeout(timer);
  }, [newSeries, deletedSeries, pageNumber]);

  useEffect(() => {
    if (seriesesInstanceRef.current) {
      seriesesInstanceRef.current.update();
    }
  }, [serieses]);

  async function fetchSerieses() {
    try {
      const response = await fetch(`/api/serieses?page=${pageNumber}&limit=4`);
      const json = await response.json();

      if (response.ok) {
        if (Array.isArray(json)) {
          // تأكد من أن البيانات المستلمة هي مصفوفة
          // دمج المسلسلات الجديدة مع المسلسلات الموجودة مع تجنب التكرارات
          setSerieses((prevSerieses) => {
            const existingIds = new Set(
              prevSerieses.map((series) => series.id)
            );
            const newSerieses = json.filter(
              (series) => !existingIds.has(series.id)
            );
            return [...prevSerieses, ...newSerieses];
          });
        } else {
          console.error('Expected array but got:', json);
        }
      } else {
        console.error('Error fetching serieses:', json);
      }
    } catch (error) {
      console.error('Error fetching serieses:', error);
    }
  }

  const handleSeriesClick = (seriesName) => {
    router.push(`/seriesAndEpisodes?seriesName=${seriesName}`);
  };

  return (
    <div className="w-full overflow-x-hidden p-2">
      <h1 className="w-full text-start p-2 text-white">جديد</h1>
      {showMessage && (
        <div className="relative w-full flex items-center justify-between text-white h-12  text-2xl px-2 ">
          <MdKeyboardDoubleArrowRight />

          <h6 className="text-sm w-full text-start">
            {' '}
            اسحب لمزيد من المسلسلات
          </h6>
        </div>
      )}
      <div
        ref={seriesesSliderRef}
        className="keen-slider shadow-lg flex flex-col items-start justify-start "
      >
        {serieses.length === 0 ? (
          <Loading />
        ) : (
          serieses
            .filter((series) => series?.seriesImage) // Filter out series with no image
            .map((series) => (
              <div
                key={series?.id}
                className="keen-slider__slide snap-center flex flex-col items-center justify-start flex-shrink-0 px-2 w-full"
                onClick={() => handleSeriesClick(series?.seriesName)}
              >
                <div className="relative w-24 h-32 sm:w-full sm:h-64 rounded-md overflow-hidden mx-2 hover:cursor-pointer">
                  <Image
                    src={series?.seriesImage}
                    layout="fill"
                    objectFit="cover"
                    objectPosition="top" // يحدد موضع الصورة من الأعلى
                    alt={series?.seriesName}
                    onError={(e) => {
                      e.target.src = '/default-image.png'; // Fallback image if loading fails
                    }}
                  />
                </div>
                <h1 className="text-white text-center m-2 text-[10px] sm:text-[15px] w-full line-clamp-2 font-bold ">
                  {series?.seriesName}
                </h1>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
