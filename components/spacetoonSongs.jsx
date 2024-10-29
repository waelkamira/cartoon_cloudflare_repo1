'use client';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useContext } from 'react';
import { inputsContext } from './Context';
import Image from 'next/image';
import Loading from './Loading';
import { TfiMenuAlt } from 'react-icons/tfi';
import SideBarMenu from './SideBarMenu';
import BackButton from './BackButton';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';

export default function SpacetoonSongs({
  vertical = false,
  image = true,
  title = true,
}) {
  const [pageNumber, setPageNumber] = useState(1);
  const [spacetoonSongs, setSpacetoonSongs] = useState([]);
  const { newSpacetoonSong, dispatch } = useContext(inputsContext);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const [previousPath, setPreviousPath] = useState('');

  // console.log('newSpacetoonSong', newSpacetoonSong);
  const [spacetoonSongsSliderRef, spacetoonSongsInstanceRef] = useKeenSlider({
    loop: false,
    mode: 'free',
    vertical: vertical ? true : false,
    rtl: vertical ? false : true,
    slides: {
      perView: () => {
        // التحقق من أن الكود يعمل في المتصفح
        if (typeof window !== 'undefined') {
          return window?.innerWidth > 768 || vertical ? 3 : 2;
        }
        return 3; // القيمة الافتراضية في بيئة السيرفر
      },
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
    fetchSpacetoonSongs();
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 40000);

    // Cleanup timer if the component is unmounted
    return () => clearTimeout(timer);
  }, [newSpacetoonSong, pageNumber]);

  useEffect(() => {
    if (spacetoonSongsInstanceRef.current) {
      spacetoonSongsInstanceRef.current.update();
    }
  }, [spacetoonSongs, newSpacetoonSong]);

  async function fetchSpacetoonSongs() {
    try {
      const response = await fetch(
        `/api/spacetoonSongs?page=${pageNumber}&limit=4&random=true`
      );
      const json = await response.json();
      if (response.ok) {
        // console.log('spacetoonSongs', spacetoonSongs);

        const existingIds = new Set(spacetoonSongs.map((song) => song.id));
        const newSpacetoonSongs = json.filter(
          (song) => !existingIds.has(song.id)
        );

        if (newSpacetoonSongs.length > 0) {
          setSpacetoonSongs((prevSpacetoonSongs) => [
            ...prevSpacetoonSongs,
            ...newSpacetoonSongs,
          ]);
        }
      }
    } catch (error) {
      console.error('Error fetching spacetoonSongs:', error);
    }
  }

  const handleSongClick = (songName) => {
    // احفظ المسار السابق
    const currentPath = window.location.pathname + window.location.search;
    setPreviousPath(currentPath);

    // التنقل إلى صفحة الأغنية
    router.push(`/spacetoonSong?spacetoonSongName=${songName}`);
    setTimeout(() => {
      const newPath = window.location.pathname + window.location.search;
      // console.log('newPath', newPath);
      // console.log('currentPath', currentPath);

      // تحديث الصفحة فقط إذا تغير المسار
      if (newPath !== previousPath && newPath.includes('/spacetoonSong')) {
        window?.location?.reload();
      }
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full overflow-x-hidden p-2 ">
      {vertical ? (
        <>
          {' '}
          <div className="absolute flex flex-col items-start gap-2 z-40 top-2 right-2 sm:top-4 sm:right-4 xl:right-12 xl:top-12">
            <TfiMenuAlt
              className="p-1 rounded-lg text-3xl lg:text-5xl text-white cursor-pointer z-50  bg-two"
              onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
          </div>
          {/* <BackButton /> */}
        </>
      ) : (
        ''
      )}

      {image ? (
        <div className="relative h-32 w-52 sm:h-60 sm:w-96">
          <Image
            src={'https://i.imgur.com/BWPdDAF.png'}
            layout="fill"
            objectFit="cover"
            alt={'زمردة'}
          />{' '}
        </div>
      ) : (
        ''
      )}

      {title ? (
        <h1 className="w-full text-start p-2 text-white">أغاني سبيس تون</h1>
      ) : (
        // <h1 className="w-full text-start p-2 text-white my-2">
        //   المزيد من الأغاني
        // </h1>
        ''
      )}
      {showMessage && (
        <div className="relative w-full flex items-center justify-between text-white h-12  text-2xl px-2 ">
          <MdKeyboardDoubleArrowRight />

          <h6 className="text-sm w-full text-start">اسحب لمزيد من الأغاني</h6>
        </div>
      )}
      <div
        ref={spacetoonSongsSliderRef}
        className={
          (vertical ? 'h-[600px]' : ' h-fit') +
          ' keen-slider py-2 shadow-lg overflow-scroll rounded-md'
        }
      >
        {spacetoonSongs.length === 0 ? (
          <Loading />
        ) : (
          // إنقاص أول 4 مسلسلات من العرض
          spacetoonSongs?.map((song) => (
            <div
              key={song?.id}
              className="keen-slider__slide snap-center flex flex-col items-center justify-start flex-shrink-0 px-2 w-full"
              // onClick={() => {
              //   dispatch({
              //     type: 'SPACETOON_SONG_NAME',
              //     payload: song?.spacetoonSongName,
              //   });

              //   // التنقل إلى الرابط الجديد
              // router.push(
              //   `/spacetoonSong?spacetoonSongName=${song?.spacetoonSongName}`
              // );
              //   setTimeout(() => {
              //     window?.location?.reload();
              //   }, 3000);
              // }}
              onClick={() => {
                dispatch({
                  type: 'SPACETOON_SONG_NAME',
                  payload: song?.spacetoonSongName,
                });
                handleSongClick(song?.spacetoonSongName);
              }}
            >
              <div
                className={
                  (vertical ? 'w-72 h-44' : 'w-40 h-[90px]') +
                  ' relative w-24 h-32 sm:w-full sm:h-64 rounded-md overflow-hidden hover:cursor-pointer'
                }
              >
                <Image
                  src={song?.spacetoonSongImage}
                  layout="fill"
                  objectFit="cover"
                  alt={song?.spacetoonSongName}
                />
              </div>
              <h1 className="text-white text-center m-2 text-[10px] sm:text-[15px] w-full line-clamp-2 font-bold">
                {song?.spacetoonSongName}
              </h1>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
