'use client';
import React, { useState, useEffect, useContext } from 'react';
import { Suspense } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { inputsContext } from './Context';
import { FaUber } from 'react-icons/fa6';
import { useSession } from 'next-auth/react';
import CurrentUser from './CurrentUser';
import LoadingPhoto from './LoadingPhoto';

// Function to normalize Arabic text
const normalizeArabic = (text) => {
  if (!text) return '';
  return text.replace(/[أ]/g, 'أ');
};

export default function SearchBar() {
  const { dispatch } = useContext(inputsContext);
  const [pageNumber, setPageNumber] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [searchedWord, setSearchedWord] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [seriesImages, setSeriesImages] = useState({}); // تخزين صور المسلسلات
  const router = useRouter();
  const session = useSession();
  const user = CurrentUser();

  // Function to perform search
  const search = async () => {
    setSearchTriggered(true);
    const queryParams = new URLSearchParams({
      page: pageNumber?.toString(),
      limit: '5',
    });

    const normalizedSearchedWord = normalizeArabic(searchedWord);

    if (normalizedSearchedWord) {
      queryParams.append('searchTerm', normalizedSearchedWord);
    }

    const res = await fetch(`/api/search?${queryParams?.toString()}`);
    const json = await res?.json();
    if (res.ok) {
      setIsVisible(true);
      setSearchResults(json);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchedWord) search();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      search();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setSearchedWord('');
    setSearchTriggered(false);
  };

  // Function to fetch episode image
  async function fetchEpisodeImage(seriesName) {
    try {
      const res = await fetch(`/api/serieses?seriesName=${seriesName}`);
      const json = await res?.json();
      if (res.ok && json.length > 0) {
        return json[0]?.seriesImage;
      }
    } catch (error) {
      console.error('Error fetching series image:', error);
    }
    return null; // Return null if there's an error or no image
  }

  // useEffect to load images for the search results
  useEffect(() => {
    async function loadImages() {
      const images = {};
      for (const result of searchResults) {
        if (result?.episodeName && result?.seriesName) {
          const image = await fetchEpisodeImage(result?.seriesName);
          images[result?.seriesName] = image || result?.seriesImage;
        }
      }
      setSeriesImages(images);
    }

    if (searchResults.length > 0) {
      loadImages();
    }
  }, [searchResults]);

  return (
    <>
      <div
        className={
          (searchTriggered
            ? 'absolute z-50 top-0 p-4 h-screen overflow-scroll bg-one'
            : '') +
          ' flex flex-col items-center justify-center w-full rounded-lg'
        }
      >
        <div className="flex flex-col justify-center items-center sm:flex-row gap-4 w-full">
          <div className="relative w-full sm:px-4">
            <input
              value={searchedWord}
              onChange={(e) => setSearchedWord(e.target.value)}
              onKeyDown={handleKeyDown}
              type="text"
              id="search_meal"
              name="search_meal"
              placeholder="ابحث عن مسلسل أو فيلم  ..."
              className="relative pr-14 py-1 sm:pr-16 border border-white w-full focus:outline-none rounded-full text-sm sm:text-xl text-black placeholder:text-[10px] sm:placeholder:text-lg sm:placeholder:px-16 text-right"
            />
            <div className="absolute flex items-center top-0 md:top-0 md:right-4 md:w-24 w-[80px] right-0 h-full rounded-r-full">
              <h1
                className="absolute flex justify-center items-center top-0 right-0 bg-one h-full text-white rounded-r-full border border-white w-fit px-2"
                onClick={handleSearch}
              >
                بحث
              </h1>
            </div>
          </div>
        </div>
        {isVisible && (
          <div className="sticky top-0 flex flex-row-reverse justify-between items-center mt-1 w-full z-50 bg-four p-4">
            <button
              onClick={handleClose}
              className="btn p-1 sm:px-4 text-white bg-five w-24 rounded-full text-sm sm:text-lg hover:bg-one shadow-lg border hover:scale-55"
            >
              إغلاق
            </button>
            <h1 className="text-sm sm:text-2xl text-nowrap mx-2 font-bold text-white">
              نتائج البحث:
            </h1>
          </div>
        )}
        {isVisible && (
          <div className="relative w-full flex flex-col items-center justify-start p-2 overflow-y-auto h-screen rounded-lg content-center ">
            {searchResults &&
              searchResults.map((result) => {
                const imageSrc =
                  seriesImages[result?.seriesName] ||
                  result?.seriesImage ||
                  result?.movieImage ||
                  result?.songImage ||
                  result?.spacetoonSongImage;

                return (
                  <>
                    {session?.status === 'authenticated' &&
                      user?.isAdmin === '1' && (
                        <button
                          className="bg-green-400 rounded-full px-2 my-2 hover:scale-105 w-fit text-center mx-2"
                          onClick={() =>
                            router.push(
                              `/editMovie?movieName=${result?.movieName}`
                            )
                          }
                        >
                          تعديل{' '}
                        </button>
                      )}
                    <div
                      onClick={async () => {
                        if (result?.episodeName) {
                          await router.push(
                            `/episodes?episodeName=${result?.episodeName}`
                          );
                          // setTimeout(() => {
                          //   window?.location?.reload();
                          // }, 3000);
                        } else if (result?.seriesName) {
                          router.push(
                            `/seriesAndEpisodes?seriesName=${result?.seriesName}`
                          );
                          // setTimeout(() => {
                          //   window?.location?.reload();
                          // }, 3000);
                        } else if (result?.movieName) {
                          await router.push(
                            `/movie?movieName=${result?.movieName}`
                          );
                          // setTimeout(() => {
                          //   window?.location?.reload();
                          // }, 3000);
                        } else if (result?.songName) {
                          dispatch({
                            type: 'SONG_NAME',
                            payload: result?.songName,
                          });
                          await router.push(
                            `/song?songName=${result?.songName}`
                          );
                          // setTimeout(() => {
                          //   window?.location?.reload();
                          // }, 3000);
                        } else if (result?.spacetoonSongName) {
                          dispatch({
                            type: 'SPACETOON_SONG_NAME',
                            payload: result?.spacetoonSongName,
                          });
                          await router.push(
                            `/spacetoonSong?spacetoonSongName=${result?.spacetoonSongName}`
                          );
                          // setTimeout(() => {
                          //   window?.location?.reload();
                          // }, 3000);
                        }
                      }}
                      className="my-2 cursor-pointer"
                    >
                      <div className="relative w-52 h-32 sm:w-96 sm:h-96">
                        {imageSrc ? (
                          <Image
                            src={imageSrc}
                            layout={'fill'}
                            objectFit={'cover'}
                            objectPosition="top"
                            alt="photo"
                          />
                        ) : (
                          <LoadingPhoto />
                        )}
                      </div>
                      <h1 className="text-white text-center m-2 text-[10px] w-full line-clamp-2 font-bold">
                        {result?.episodeName ||
                          result?.movieName ||
                          result?.seriesName ||
                          result?.songName ||
                          result?.spacetoonSongName}
                      </h1>
                    </div>
                  </>
                );
              })}
          </div>
        )}
      </div>
    </>
  );
}
