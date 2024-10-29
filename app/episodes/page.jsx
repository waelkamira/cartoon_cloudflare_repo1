'use client';
import React, { useState, useEffect, useCallback } from 'react';
import VideoPlayer from '../../components/VideoPlayer';
import Loading from '../../components/Loading';
import BackButton from '../../components/BackButton';
import SideBarMenu from '../../components/SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import LoadingPhoto from '../../components/LoadingPhoto';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import HappyTagAd from '../../components/ads/happyTagAd';
import ExoclickOutStreamVideo from '../../components/ads/exoclickOutStreamVideo';
import ExoclickVideoSlider from '../../components/ads/exoclickVideoSlider';

export default function Page() {
  const [episodes, setEpisodes] = useState([]);
  const [episodeNumber, setEpisodeNumber] = useState(1); // التحكم برقم الحلقة
  const [isLoading, setIsLoading] = useState(false);
  const [episodeName, setEpisodeName] = useState('');
  const [episodeImage, setEpisodeImage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isTrue, setIsTrue] = useState(true);
  const [hasMoreEpisodes, setHasMoreEpisodes] = useState(true);
  const router = useRouter();

  // استخدام URL parameters لجلب اسم الحلقة
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const episodeNameParam = params.get('episodeName');
    if (episodeNameParam) {
      // console.log('episodeNameParam', episodeNameParam);

      setEpisodeName(episodeNameParam);
      fetchEpisode(episodeNameParam);
      extractEpisodeNumber(episodeNameParam);
    }
  }, []);

  // استخراج رقم الحلقة من اسمها
  function extractEpisodeNumber(episodeName) {
    const regex = /الحلقة\s+(\d+)/; // تعبير منتظم لاستخراج الرقم بعد كلمة "الحلقة"
    const match = episodeName.match(regex);

    if (match && match[1]) {
      localStorage.setItem('episodeNumber', match[1]);
      // console.log('episodeNumber', match[1]);

      setEpisodeNumber(parseInt(match[1], 10));
    } else {
      return null; // إذا لم يتم العثور على الرقم
    }
  }

  // جلب الحلقة بناءً على الرقم واسم المسلسل
  const fetchEpisode = useCallback(
    async (episodeName) => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/episodes?episodeName=${episodeName}`
        );

        const json = await response.json();
        // console.log('json', json);

        // التحقق من نجاح الاستجابة
        if (response.ok) {
          if (json.length > 0) {
            fetchEpisodeImage(json[0]?.seriesName);
            setEpisodes([json[0]]);
            // إنشاء اسم الحلقة التالية بناءً على رقم الحلقة الحالي +1
            const seriesName = json[0].seriesName || 'لا يوجد اسم';
            const regex = /الحلقة\s+(\d+)/; // تعبير منتظم لاستخراج الرقم بعد كلمة "الحلقة"
            const match = episodeName.match(regex);
            const nextEpisodeName = `${seriesName} الحلقة ${
              parseInt(match[1]) + 1
            }`;
            // console.log('nextEpisodeName', nextEpisodeName); // طباعة اسم الحلقة التالية للتحقق

            // إرسال طلب جديد للتحقق مما إذا كانت هناك حلقة تالية
            const nextResponse = await fetch(
              `/api/episodes?episodeName=${nextEpisodeName}`
            );
            const res = await nextResponse.json();

            // إذا كانت الاستجابة للحلقة التالية غير ناجحة أو لم يتم العثور على حلقة تالية (الطول 0)
            if (res?.length > 0) {
              // console.log('لايوجد حلقات اضافية'); // طباعة رسالة تفيد بعدم وجود حلقات إضافية
              setHasMoreEpisodes(true); // تعيين الحالة للإشارة إلى عدم وجود حلقات إضافية
            } else {
              setHasMoreEpisodes(false); // تعيين الحالة للإشارة إلى عدم وجود حلقات إضافية
            }
          } else {
            // إذا لم يتم العثور على أي حلقة في JSON، تعيين الحالة لعدم وجود حلقات إضافية
            setHasMoreEpisodes(false);
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

  // جلب صورة المسلسل بناءً على اسم المسلسل
  async function fetchEpisodeImage(seriesName) {
    try {
      const res = await fetch(
        `/api/serieses?seriesName=${encodeURIComponent(seriesName)}`
      );
      const json = await res.json();
      if (res.ok && json.length > 0) {
        setEpisodeImage(json[0]?.seriesImage);
      }
    } catch (error) {
      console.error('Error fetching series image:', error);
    }
    return null;
  }

  // حفظ رقم الحلقة في localStorage عند تحميل الصفحة
  useEffect(() => {
    const savedEpisodeNumber = localStorage.getItem('episodeNumber');
    if (savedEpisodeNumber) {
      setEpisodeNumber(parseInt(savedEpisodeNumber, 10));
    }
  }, []);

  // التبديل للحلقة التالية
  const handleNextEpisode = (seriesName) => {
    const nextEpisodeNumber = episodeNumber + 1;
    const nextEpisodeName = `${seriesName} الحلقة ${nextEpisodeNumber}`;
    router.push(`/episodes?episodeName=${nextEpisodeName}`);
    setEpisodeNumber(nextEpisodeNumber);
    localStorage.setItem('episodeNumber', nextEpisodeNumber); // حفظ رقم الحلقة الجديد في localStorage
    setTimeout(() => {
      window?.location?.reload();
    }, 3000);
  };

  // التبديل للحلقة السابقة
  const handlePreviousEpisode = (seriesName) => {
    if (episodeNumber > 1) {
      const prevEpisodeNumber = episodeNumber - 1;
      const nextEpisodeName = `${seriesName} الحلقة ${prevEpisodeNumber}`;
      router.push(`/episodes?episodeName=${nextEpisodeName}`);
      setEpisodeNumber(prevEpisodeNumber);
      localStorage.setItem('episodeNumber', prevEpisodeNumber); // حفظ رقم الحلقة الجديد في localStorage
      setTimeout(() => {
        window?.location?.reload();
      }, 3000);
    }
  };

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
          {episodes.length > 0 && episodeImage ? (
            <Image
              priority
              src={episodeImage}
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
            setIsTrue(false);
          }}
        >
          {/* <BackButton /> */}
        </div>

        <h1 className="grow text-lg lg:text-2xl w-full text-white">
          <span className="text-gray-500 ml-2">#</span>
          اسم المسلسل <span className="">{episodes[0]?.seriesName}</span>
        </h1>
      </div>
      <div className="my-2 p-2">
        {episodes.length === 0 && !isLoading && (
          <Loading myMessage={'😉 لا يوجد نتائج لعرضها'} />
        )}
        {episodes.length > 0 && (
          <div>
            {episodes.map((episode) => (
              <div
                key={episode.id}
                className="flex flex-col items-center justify-start  overflow-hidden"
              >
                <div className={'w-full'}>
                  <HappyTagAd render={episode?.episodeLink} />
                  <h1 className="text-white text-center p-2">
                    {episode?.episodeName}
                  </h1>
                  <ExoclickOutStreamVideo />
                  <VideoPlayer
                    videoUrl={episode?.episodeLink}
                    image={episodeImage}
                    episodeName={episode?.episodeName}
                    showAd={isTrue}
                    onNextEpisode={handleNextEpisode} // تمرير دالة الانتقال للحلقة التالية
                  />
                </div>
                <div className="flex justify-between w-full p-4 items-start">
                  <button
                    onClick={() => handleNextEpisode(episode?.seriesName)}
                    className="btn p-1 sm:px-4 sm:py-2 shadow-lg text-white rounded-lg disabled:opacity-50"
                    disabled={!hasMoreEpisodes} // تعطيل زر الحلقة التالية إذا لم تكن هناك حلقات
                  >
                    الحلقة التالية
                  </button>
                  <button
                    onClick={() => handlePreviousEpisode(episode?.seriesName)}
                    className="btn p-1 sm:px-4 sm:py-2 shadow-lg text-white rounded-lg disabled:opacity-50"
                    disabled={episodeNumber === 1} // تعطيل زر الحلقة السابقة إذا كانت الحلقة الأولى
                  >
                    الحلقة السابقة
                  </button>
                </div>
                {/* <ExoclickVideoSlider /> */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
