'use client';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useContext } from 'react';
import { inputsContext } from './Context';
import Loading from './Loading';
import 'keen-slider/keen-slider.min.css';
import Image from 'next/image';
import { TfiMenuAlt } from 'react-icons/tfi';
import SideBarMenu from './SideBarMenu';
import CustomToast from './CustomToast';
import toast from 'react-hot-toast';
import CurrentUser from './CurrentUser';
import { useSession } from 'next-auth/react';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';

export default function EnglishCartoon({ vertical = false, image }) {
  const [pageNumber, setPageNumber] = useState(1);
  const [englishCartoon, setEnglishCartoon] = useState([]);
  const { newSeries, deletedSeries } = useContext(inputsContext);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const user = CurrentUser();
  const session = useSession();
  const [showMessage, setShowMessage] = useState(true);
  const [previousPath, setPreviousPath] = useState('');

  // console.log('user', user);
  console.log('vertical', vertical);
  const [englishCartoonSliderRef, englishCartoonInstanceRef] = useKeenSlider({
    loop: false,
    mode: 'free',
    vertical: vertical ? true : false,
    rtl: vertical ? false : true,
    slides: {
      perView: 3,
      spacing: () => {
        // التحقق من أن الكود يعمل في المتصفح
        if (typeof window !== 'undefined') {
          return window.innerWidth < 768 ? 3 : 17;
        }
        return 17; // القيمة الافتراضية في بيئة السيرفر
      },
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
    fetchEnglishCartoon();
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 70000);

    // Cleanup timer if the component is unmounted
    return () => clearTimeout(timer);
  }, [newSeries, deletedSeries, pageNumber]);

  useEffect(() => {
    if (englishCartoonInstanceRef.current) {
      englishCartoonInstanceRef.current.update();
    }
  }, [englishCartoon, newSeries]);

  async function fetchEnglishCartoon() {
    try {
      const response = await fetch(
        `/api/englishCartoon?page=${pageNumber}&limit=4`
      );
      const json = await response.json();
      if (response.ok) {
        console.log('englishCartoon', json);

        const existingIds = new Set(
          englishCartoon.map((episode) => episode.id)
        );
        const newEnglishCartoon = json.filter(
          (episode) => !existingIds.has(episode.id)
        );

        if (newEnglishCartoon.length > 0) {
          setEnglishCartoon((prevEnglishCartoon) => [
            ...prevEnglishCartoon,
            ...newEnglishCartoon,
          ]);
        }
      }
    } catch (error) {
      console.error('Error fetching englishCartoon:', error);
    }
  }
  async function handleAdd(id) {
    // console.log('id', id);
    const response = await fetch('/api/englishCartoon', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id }),
    });
    if (response.ok) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          emoji={'🧀'}
          message={'تم إضافة المسلسل الى الأكثر مشاهدة'}
          greenEmoji={'✔'}
        />
      ));
    }
  }

  const handleSongClick = (episodeName) => {
    // احفظ المسار السابق
    const currentPath = window.location.pathname + window.location.search;
    setPreviousPath(currentPath);

    // التنقل إلى صفحة الأغنية
    router.push(`/englishEpisodes?episodeName=${episodeName}`);
    setTimeout(() => {
      const newPath = window.location.pathname + window.location.search;
      // تحديث الصفحة فقط إذا تغير المسار
      if (newPath !== previousPath && newPath.includes('/englishEpisodes')) {
        window?.location?.reload();
      }
    }, 3000);
  };
  return (
    <div className="flex flex-col items-center justify-center w-full overflow-x-hidden p-2 bg-one">
      {vertical ? (
        <div className="absolute flex flex-col items-start gap-2 z-40 top-2 right-2 sm:top-4 sm:right-4 xl:right-12 xl:top-12">
          <TfiMenuAlt
            className="p-1 rounded-lg text-3xl lg:text-5xl text-white cursor-pointer z-50  bg-two"
            onClick={() => setIsOpen(!isOpen)}
          />
          {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
        </div>
      ) : (
        ''
      )}

      {image ? (
        <>
          <div className="relative h-44 w-52 sm:h-64 sm:w-80">
            <Image
              src={'https://i.imgur.com/bw6ZZCJ.png'}
              layout="fill"
              objectFit="cover"
              alt={'englishCartoon'}
            />{' '}
          </div>

          <h1 className="w-fit text-start p-2 text-white my-2 bg-one">
            English Cartoon
          </h1>
        </>
      ) : (
        ''
      )}
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
        ref={englishCartoonSliderRef}
        className={
          (vertical ? 'h-[600px]' : 'h-fit') +
          ' keen-slider  py-2 shadow-lg  overflow-scroll rounded-md'
        }
      >
        {englishCartoon.length === 0 ? (
          <Loading />
        ) : (
          // إنقاص أول 4 مسلسلات من العرض
          englishCartoon?.map((episode) => (
            <div
              key={episode?.id}
              className="keen-slider__slide snap-center flex flex-col items-center my-4"
            >
              {session?.status === 'authenticated' && user?.isAdmin === '1' && (
                <button
                  className="bg-green-400 rounded-full px-2 my-2 hover:scale-105 w-fit text-center mx-2"
                  onClick={() => handleAdd(episode?.id)}
                >
                  إضافة
                </button>
              )}
              <div
                className=" flex flex-col items-center justify-start flex-shrink-0 w-full mr-1"
                key={episode?.id}
                onClick={() => handleSongClick(episode?.episodeName)}
              >
                <div
                  className={
                    (vertical ? 'w-72 h-44' : 'w-24 h-32') +
                    ' relative w-24 h-32 sm:w-full sm:h-64 rounded-md overflow-hidden hover:cursor-pointer'
                  }
                >
                  <Image
                    src={episode?.episodeImage}
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center" // يحدد موضع الصورة من الأعلى
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
