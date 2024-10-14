'use client';

import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { inputsContext } from '../components/Context';
import CustomToast from './CustomToast';
import UploadingAndDisplayingImage from './UploadingAndDisplayingImage';

export default function SeriesForm({ setIsVisible, isVisible, cancel = true }) {
  const [inputs, setInputs] = useState({
    seriesName: '',
    seriesImage: '',
    planetName: '',
  });
  const { data, dispatch } = useContext(inputsContext);

  useEffect(() => {
    setInputs({
      ...inputs,
      seriesImage: data?.image,
    });
  }, [data?.selectedValue, data?.image]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (inputs?.seriesName && inputs?.seriesImage && inputs?.planetName) {
      try {
        const response = await fetch('/api/serieses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...inputs,
          }),
        });

        if (response.ok) {
          dispatch({ type: 'NEW_SERIES', payload: inputs });
          setIsVisible(false);
          toast.custom((t) => (
            <CustomToast
              t={t}
              emoji={'🧀'}
              message={'تم إنشاء  مسلسل جديد'}
              greenEmoji={'✔'}
            />
          ));
          handleClick();
          setInputs({
            seriesName: '',
            seriesImage: '',
          });
        } else {
          console.log('something went wrong!');
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      if (!inputs.seriesImage) {
        toast.custom((t) => (
          <CustomToast t={t} message={'صورة المسلسل مطلوبة 😐'} />
        ));
      } else if (!inputs.seriesName) {
        toast.custom((t) => (
          <CustomToast t={t} message={'اسم المسلسل مطلوب 😐'} />
        ));
      } else if (!inputs.planetName) {
        toast.custom((t) => (
          <CustomToast t={t} message={'اسم الكوكب مطلوب 😐'} />
        ));
      }
    }
  }

  return (
    <>
      {isVisible && (
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
                      اسم المسلسل: (إجباري)
                    </h1>
                  </div>
                  <input
                    value={inputs.seriesName}
                    onChange={(e) =>
                      setInputs({ ...inputs, seriesName: e.target.value })
                    }
                    type="text"
                    id="اسم المسلسل"
                    name="اسم المسلسل"
                    autoFocus
                    className="text-right w-full p-2 rounded-lg text-lg outline-2 focus:outline-one h-10 placeholder:text-sm placeholder:sm:text-lg"
                  />
                  <div className="flex items-center gap-2 w-full justify-start">
                    <h1 className="text-right text-md sm:text-xl text-white sm:font-bold my-2 ">
                      <span className="text-one sm:font-bold text-2xl ml-2">
                        #
                      </span>
                      اسم الكوكب: (إجباري)
                    </h1>
                  </div>
                  <select
                    name="كوكب"
                    id="كوكب"
                    className="w-full text-xl p-2 rounded-md"
                    onChange={(e) =>
                      setInputs({ ...inputs, planetName: e.target.value })
                    }
                  >
                    <option value=""></option>
                    <option value="زمردة">زمردة</option>
                    <option value="مغامرات">مغامرات</option>
                    <option value="رياضة">رياضة</option>
                    <option value="أكشن">أكشن</option>
                    <option value="الصيصان">الصيصان</option>
                  </select>
                  {/* <input
                    value={inputs.planetName}
                    onChange={(e) =>
                      setInputs({ ...inputs, planetName: e.target.value })
                    }
                    type="text"
                    id="اسم الكوكب"
                    name="اسم الكوكب"
                    autoFocus
                    className="text-right w-full p-2 rounded-lg text-lg outline-2 focus:outline-one h-10 placeholder:text-sm placeholder:sm:text-lg"
                  /> */}
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
                    setIsVisible(false);
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
