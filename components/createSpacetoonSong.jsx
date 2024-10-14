'use client';

import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { inputsContext } from './Context';
import CustomToast from './CustomToast';
import UploadingAndDisplayingImage from './UploadingAndDisplayingImage';

export default function SpacetoonSongForm({
  setIsSpacetoonOpen,
  isSpacetoonOpen,
  cancel = true,
}) {
  const [inputs, setInputs] = useState({
    spacetoonSongName: '',
    spacetoonSongImage: '',
    spacetoonSongLink: '',
  });
  const { data, dispatch } = useContext(inputsContext);

  useEffect(() => {
    setInputs({
      ...inputs,
      spacetoonSongImage: data?.image,
    });
  }, [data?.selectedValue, data?.image]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      inputs?.spacetoonSongName &&
      inputs?.spacetoonSongImage &&
      inputs?.spacetoonSongLink
    ) {
      try {
        const response = await fetch('/api/spacetoonSongs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...inputs,
          }),
        });

        if (response.ok) {
          dispatch({ type: 'NEW_SPACETOON_SONG', payload: inputs });
          setIsSpacetoonOpen(false);
          toast.custom((t) => (
            <CustomToast
              t={t}
              emoji={'🧀'}
              message={'تم إنشاء أغنية جديدة'}
              greenEmoji={'✔'}
            />
          ));
          setInputs({
            spacetoonSongName: '',
            spacetoonSongImage: '',
            spacetoonSongLink: '',
          });
          handleClick();
        } else {
          console.log('something went wrong!');
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      if (!inputs.spacetoonSongImage) {
        toast.custom((t) => (
          <CustomToast t={t} message={'صورة الأغنية مطلوبة 😐'} />
        ));
      } else if (!inputs.spacetoonSongName) {
        toast.custom((t) => (
          <CustomToast t={t} message={'اسم الأغنية مطلوب 😐'} />
        ));
      } else if (!inputs.spacetoonSongLink) {
        toast.custom((t) => (
          <CustomToast t={t} message={'رابط الأغنية مطلوب 😐'} />
        ));
      }
    }
  }

  return (
    <>
      {isSpacetoonOpen && (
        <div className="w-full p-2 sm:p-8 h-fit ">
          <form
            className="flex flex-col justify-center items-start h-fit w-full mt-4 "
            onSubmit={handleSubmit}
          >
            <div className="w-full">
              <div className="flex flex-col gap-8 md:flex-row w-full ">
                <div className="flex flex-col items-center justify-center w-full">
                  <UploadingAndDisplayingImage />
                  <div className="flex items-center gap-2 w-full justify-start">
                    <h1 className="text-right text-md sm:text-xl text-white sm:font-bold my-2 ">
                      <span className="text-one sm:font-bold text-2xl ml-2">
                        #
                      </span>
                      اسم الأغنية: (إجباري)
                    </h1>
                  </div>
                  <input
                    value={inputs.spacetoonSongName}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        spacetoonSongName: e.target.value,
                      })
                    }
                    type="text"
                    id="اسم الأغنية"
                    name="اسم الأغنية"
                    autoFocus
                    className="text-right w-full p-2 rounded-lg text-lg outline-2 focus:outline-one h-10 placeholder:text-sm placeholder:sm:text-lg"
                  />
                  <div className="flex flex-col items-center justify-center w-full">
                    <div className="flex items-center gap-2 w-full justify-start">
                      <h1 className="text-right text-md sm:text-xl text-white sm:font-bold my-2 ">
                        <span className="text-one sm:font-bold text-2xl ml-2">
                          #
                        </span>
                        رابط الأغنية: (إجباري)
                      </h1>
                    </div>
                    <input
                      value={inputs.spacetoonSongLink}
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          spacetoonSongLink: e.target.value,
                        })
                      }
                      type="text"
                      id="رابط الأغنية"
                      name="رابط الأغنية"
                      autoFocus
                      className="text-right w-full p-2 rounded-lg text-lg outline-2 focus:outline-one h-10 placeholder:text-sm placeholder:sm:text-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-around items-center gap-8 w-full my-12">
              <button
                type="submit"
                className="btn bg-five rounded-lg text-white shadow-lg hover:outline outline-one text-xl hover:sm:font-bold py-2 px-16 w-full"
              >
                حفظ
              </button>
              {cancel && (
                <button
                  type="text"
                  className="btn bg-five rounded-lg text-white shadow-lg hover:outline outline-one text-xl hover:sm:font-bold py-2 px-16 w-full"
                  onClick={() => {
                    setIsSpacetoonOpen(false);
                  }}
                >
                  إلغاء
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </>
  );
}
