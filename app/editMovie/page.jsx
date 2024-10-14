'use client';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import UploadingAndDisplayingImage from '../../components/UploadingAndDisplayingImage';
import { inputsContext } from '../../components/Context';
import Button from '../../components/Button';
import CustomToast from '../../components/CustomToast';
import toast from 'react-hot-toast';

export default function EditMovie() {
  const [movie, setMovie] = useState([]);
  const { data } = useContext(inputsContext);
  const [inputs, setInputs] = useState({
    movieName: movie?.movieName,
    movieImage: data?.image || movie?.movieImage,
    movieLink: movie?.movieLink,
  });
  // console.log('data?.image', data?.image);
  // console.log('inputs', inputs);
  // console.log('movie:', movie);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const getMovieName = params.get('movieName');
    // console.log('getMovieName', getMovieName);

    if (getMovieName) {
      bringMovie(getMovieName);
    }
  }, []);

  useEffect(() => {
    if (data?.image && data.image !== inputs.movieImage) {
      setInputs((prevInputs) => ({
        ...prevInputs,
        movieImage: data.image,
      }));
    }
  }, [data?.image]);

  async function bringMovie(getMovieName) {
    if (getMovieName) {
      // console.log('Fetching movie:', getMovieName);
      const response = await fetch(`/api/movies?movieName=${getMovieName}`);
      const json = await response?.json();
      if (response.ok) {
        setMovie(json);
        setInputs({
          movieName: json[0]?.movieName,
          movieImage: json[0]?.movieImage,
          movieLink: json[0]?.movieLink,
        });
        // console.log('Fetched movie data:', json);
      } else {
        console.error('Failed to fetch movie');
      }
    }
  }

  async function updateMovie() {
    const response = await fetch(`/api/movies?movieName=${inputs?.movieName}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: movie[0]?.id, // استخدام id للتحديث
        movieName: inputs.movieName,
        movieImage: inputs.movieImage,
        movieLink: inputs.movieLink,
      }),
    });

    if (response.ok) {
      // console.log('movie updated');
      toast.custom((t) => (
        <CustomToast t={t} message={'تم تعديل الفيلم بنجاح'} />
      ));
    } else {
      console.log('something went wrong');
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      {movie?.length > 0 &&
        movie.map((item) => {
          return (
            <div
              key={item?.movieName}
              className="flex flex-col items-center justify-center"
            >
              <UploadingAndDisplayingImage img={item?.movieImage} />

              <h1
                contentEditable
                onInput={(e) =>
                  setInputs({
                    ...inputs,
                    movieLink: e.currentTarget.textContent,
                  })
                }
                className="line-clamp-1"
              >
                {item?.movieLink}
              </h1>
              <h1
                contentEditable
                suppressContentEditableWarning={true} // إضافة لتجنب التحذيرات
                onInput={(e) =>
                  setInputs({
                    ...inputs,
                    movieName: e.currentTarget.textContent.trim(), // استخدم trim لإزالة المسافات الزائدة
                  })
                }
                className="line-clamp-1"
              >
                {inputs.movieName} {/* تأكد من عرض قيمة movieName من inputs */}
              </h1>
            </div>
          );
        })}
      <Button
        title="تعديل"
        onClick={() => updateMovie()}
        className="bg-white"
      />
    </div>
  );
}
