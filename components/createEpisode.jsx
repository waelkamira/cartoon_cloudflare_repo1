'use client';

import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { inputsContext } from './Context';
import CustomToast from './CustomToast';
import UploadingAndDisplayingImage from './UploadingAndDisplayingImage';

export default function EpisodeForm({ setShow, show, cancel = true }) {
  const [inputs, setInputs] = useState({
    seriesName: '',
    episodeName: '',
    episodeLink: '',
  });

  async function handleSubmit(e) {
    e.preventDefault();

    if (inputs?.episodeName && inputs?.episodeLink && inputs?.seriesName) {
      try {
        const response = await fetch('/api/episodes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...inputs,
          }),
        });

        if (response.ok) {
          setShow(false);
          toast.custom((t) => (
            <CustomToast
              t={t}
              emoji={'🧀'}
              message={'تم إنشاء  حلقة جديدة'}
              greenEmoji={'✔'}
            />
          ));
          setInputs({
            seriesName: '',
            episodeName: '',
            episodeLink: '',
          });
        } else {
          console.log('something went wrong!');
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      if (!inputs.seriesName) {
        toast.custom((t) => (
          <CustomToast t={t} message={'اسم المسلسل مطلوب 😐'} />
        ));
      } else if (!inputs.episodeName) {
        toast.custom((t) => (
          <CustomToast t={t} message={'اسم الحلقة مطلوب 😐'} />
        ));
      } else if (!inputs.episodeLink) {
        toast.custom((t) => (
          <CustomToast t={t} message={'رابط الحلقة مطلوب 😐'} />
        ));
      }
    }
  }

  return (
    <>
      {show && (
        <div className="w-full p-2 sm:p-8 h-fit ">
          <form
            className="flex flex-col justify-center items-start h-fit w-full mt-4 "
            onSubmit={handleSubmit}
          >
            <div className="w-full">
              <div className="flex flex-col gap-8 md:flex-row w-full ">
                <div className="flex flex-col items-center justify-center w-full">
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
                </div>
                <div className="flex flex-col items-center justify-center w-full">
                  <div className="flex items-center gap-2 w-full justify-start">
                    <h1 className="text-right text-md sm:text-xl text-white sm:font-bold my-2 ">
                      <span className="text-one sm:font-bold text-2xl ml-2">
                        #
                      </span>
                      اسم الحلقة: (إجباري)
                    </h1>
                  </div>
                  <input
                    value={inputs.episodeName}
                    onChange={(e) =>
                      setInputs({ ...inputs, episodeName: e.target.value })
                    }
                    type="text"
                    id="اسم الحلقة"
                    name="اسم الحلقة"
                    autoFocus
                    className="text-right w-full p-2 rounded-lg text-lg outline-2 focus:outline-one h-10 placeholder:text-sm placeholder:sm:text-lg"
                  />
                </div>
                <div className="flex flex-col items-center justify-center w-full">
                  <div className="flex items-center gap-2 w-full justify-start">
                    <h1 className="text-right text-md sm:text-xl text-white sm:font-bold my-2 ">
                      <span className="text-one sm:font-bold text-2xl ml-2">
                        #
                      </span>
                      رابط الحلقة: (إجباري)
                    </h1>
                  </div>
                  <input
                    value={inputs.episodeLink}
                    onChange={(e) =>
                      setInputs({ ...inputs, episodeLink: e.target.value })
                    }
                    type="text"
                    id="رابط الحلقة"
                    name="رابط الحلقة"
                    autoFocus
                    className="text-right w-full p-2 rounded-lg text-lg outline-2 focus:outline-one h-10 placeholder:text-sm placeholder:sm:text-lg"
                  />
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
                    setShow(false);
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
