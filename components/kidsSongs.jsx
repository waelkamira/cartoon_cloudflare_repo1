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

export default function KidsSongs({
  vertical = false,
  image = true,
  title = true,
}) {
  const [pageNumber, setPageNumber] = useState(1);
  const [songs, setSongs] = useState([]);
  const { newSong, deletedSong, dispatch } = useContext(inputsContext);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const [previousPath, setPreviousPath] = useState('');

  const [songsSliderRef, songsInstanceRef] = useKeenSlider({
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
    fetchSongs();
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 90000);

    // Cleanup timer if the component is unmounted
    return () => clearTimeout(timer);
  }, [newSong, deletedSong, pageNumber]);

  useEffect(() => {
    if (songsInstanceRef.current) {
      songsInstanceRef.current.update();
    }
  }, [songs, newSong]);

  async function fetchSongs() {
    try {
      const response = await fetch(
        `/api/songs?page=${pageNumber}&limit=4&random=true`
      );
      const json = await response.json();
      if (response.ok) {
        // console.log('songs', songs);

        const existingIds = new Set(songs.map((song) => song.id));
        const newSongs = json.filter((song) => !existingIds.has(song.id));

        if (newSongs.length > 0) {
          setSongs((prevSongs) => [...prevSongs, ...newSongs]);
        }
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  }

  const handleSongClick = (songName) => {
    // احفظ المسار السابق
    const currentPath = window.location.pathname + window.location.search;
    setPreviousPath(currentPath);

    // التنقل إلى صفحة الأغنية
    router.push(`/song?songName=${songName}`);

    setTimeout(() => {
      const newPath = window.location.pathname + window.location.search;
      // تحديث الصفحة فقط إذا تغير المسار
      if (newPath !== previousPath && newPath.includes('/song')) {
        window?.location?.reload();
      }
    }, 3000);
  };
  return (
    <div className="relative flex flex-col items-center justify-center w-full overflow-x-hidden p-2 bg-one">
      {!vertical ? (
        <>
          <div className="absolute flex flex-col items-start gap-2 z-40 top-2 right-2 sm:top-4 sm:right-4 xl:right-12 xl:top-12">
            <TfiMenuAlt
              className="p-1 rounded-lg text-3xl lg:text-5xl text-white cursor-pointer z-50 bg-two"
              onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
          </div>
        </>
      ) : (
        ''
      )}

      {image ? (
        <div className="relative h-44 w-48 sm:h-[300px] sm:w-80">
          <Image
            src={'https://i.imgur.com/rRBpVhp.png'}
            layout="fill"
            objectFit="cover"
            alt={'أغاني أطفال'}
          />{' '}
        </div>
      ) : (
        ''
      )}

      {title ? (
        <h1 className="w-full text-start p-2 text-white my-2">أغاني أطفال</h1>
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
        ref={songsSliderRef}
        className={
          (vertical ? 'h-[600px]' : ' h-fit') +
          ' keen-slider py-2 shadow-lg overflow-scroll rounded-md'
        }
      >
        {songs.length === 0 ? (
          <Loading />
        ) : (
          // إنقاص أول 4 مسلسلات من العرض
          songs?.map((song) => (
            <div
              key={song?.id}
              className="keen-slider__slide snap-center flex flex-col items-center justify-start flex-shrink-0 px-2 w-full"
              onClick={() => {
                dispatch({ type: 'KIDS_SONG_NAME', payload: song?.songName });
                handleSongClick(song?.songName);
              }}
            >
              <div
                className={
                  (vertical ? 'w-72 h-44' : 'w-40 h-[90px]') +
                  ' relative w-24 h-32 sm:w-full sm:h-64 rounded-md overflow-hidden hover:cursor-pointer'
                }
              >
                <Image
                  src={song?.songImage}
                  layout="fill"
                  objectFit="cover"
                  alt={song?.songName}
                />
              </div>
              <h1 className="text-white text-center m-2 text-[10px] sm:text-[15px] w-full line-clamp-2 font-bold">
                {song?.songName}
              </h1>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
