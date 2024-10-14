'use client';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useContext, use } from 'react';
import { inputsContext } from './Context';
import Image from 'next/image';
import Loading from './Loading';
import CurrentUser from './CurrentUser';

export default function MoviesPlanetMostViewed() {
  const [pageNumber, setPageNumber] = useState(1);
  const [moviesMostViewed, setMoviesMostViewed] = useState([]);
  const { newMovie, deletedMovie } = useContext(inputsContext);
  const router = useRouter();
  const user = CurrentUser();
  // console.log('user', user);

  const [moviesMostViewedSliderRef, moviesMostViewedInstanceRef] =
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
    fetchMoviesMostViewed();
  }, [newMovie, deletedMovie, pageNumber]);

  useEffect(() => {
    if (moviesMostViewedInstanceRef.current) {
      moviesMostViewedInstanceRef.current.update();
    }
  }, [moviesMostViewed]);

  async function fetchMoviesMostViewed() {
    try {
      const response = await fetch(
        `/api/movies?page=${pageNumber}&limit=4&&mostViewed=${true}`
      );
      const json = await response?.json();
      if (response.ok) {
        // console.log('json', json);
        const existingIds = new Set(moviesMostViewed.map((movie) => movie.id));
        const newMoviesMostViewed = json.filter(
          (movie) => !existingIds.has(movie.id)
        );

        if (newMoviesMostViewed.length > 0) {
          setMoviesMostViewed((prevMoviesMostViewed) => [
            ...prevMoviesMostViewed,
            ...newMoviesMostViewed,
          ]);
        }
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full overflow-x-hidden p-2 ">
      <h1 className="w-full text-start p-2 text-white">الأكثر مشاهدة</h1>

      <div ref={moviesMostViewedSliderRef} className="keen-slider  shadow-lg">
        {moviesMostViewed?.length === 0 ? (
          <Loading />
        ) : (
          // إنقاص أول 4 مسلسلات من العرض
          moviesMostViewed?.map((movie) => (
            <div
              key={movie.id}
              className="keen-slider__slide snap-center flex flex-col items-center"
            >
              <div
                className=" flex flex-col items-center justify-start flex-shrink-0 px-2 w-full"
                key={movie.id}
                onClick={() => {
                  // التنقل إلى الرابط الجديد
                  router.push(`/movie?movieName=${movie.movieName}`);
                }}
              >
                <div className="relative w-24 h-32 sm:w-full sm:h-64 rounded-md overflow-hidden hover:cursor-pointer">
                  <Image
                    src={movie.movieImage}
                    layout="fill"
                    objectFit="cover"
                    objectPosition="top" // يحدد موضع الصورة من الأعلى
                    alt={movie.movieName}
                  />
                </div>
                <h1 className="text-white text-center m-2 text-[10px] sm:text-[15px] w-full line-clamp-2 font-bold">
                  {movie.movieName}
                </h1>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
