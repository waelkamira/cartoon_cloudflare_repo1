'use client';
import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import Button from '../Button';

export const ContactUs = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    message: '',
  });
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    const createPromise = new Promise(async (resolve, reject) => {
      const promise = emailjs
        .sendForm(
          process.env.NEXT_PUBLIC_SERVES_ID,
          process.env.NEXT_PUBLIC_TEMPLATE_ID,
          form.current,
          {
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_ID,
          }
        )
        .then(
          () => {
            console.log('SUCCESS!');
          },
          (error) => {
            console.log('FAILED...', error.text);
          }
        );
      if (promise) {
        resolve();
        setUserInfo({ name: '', email: '', message: '' });
      } else {
        reject();
      }
    });

    toast.promise(createPromise, {
      loading: 'Sending ...',
      success: 'تم إرسال رسالتك بنجاح',
      error: 'حدث خطأ ما حاول مرة أخرى',
    });
  };

  const placeholderText = `اكتب اسم المسلسل و رقم الحلقة أو اسم الفيلم الذي يحتوي على أشياء مخالفة للعقيدة الإسلامية ليتم حذفه فورا
اكتب اسم المسلسل ورقم الحلقة أو اسم الفيلم الذي لا يعمل لنقوم بإصلاحه إن شاء الله`;

  return (
    <>
      <h1
        className=" btn w-fit tex-lg sm:text-xl text-white p-2 cursor-pointer rounded-lg shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'إغلاق' : 'الإبلاغ عن رابط لا يعمل'}
      </h1>
      <div className="w-full bg-one">
        {isOpen && (
          <form
            ref={form}
            onSubmit={sendEmail}
            className="flex flex-col items-center gap-4"
          >
            <div className=" w-full flex flex-col sm:flex-row justify-between items-center lg:gap-16 sm:gap-8">
              <div className="w-full flex flex-col grow">
                <label className="tex-lg sm:text-xl text-white p-2 ">
                  الإسم:{' '}
                </label>
                <input
                  value={userInfo?.name}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, name: e.target.value })
                  }
                  required
                  type="text"
                  name="user_name"
                  placeholder="اسمك"
                  className="p-2 rounded-lg outline-none shadow-none border-2 focus:border-primary border-solid tex-lg sm:text-xl "
                />
              </div>
              <div className="w-full flex flex-col grow">
                <label className="tex-lg sm:text-xl text-white p-2 ">
                  الإيميل:{' '}
                </label>
                <input
                  value={userInfo?.email}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, email: e.target.value })
                  }
                  required
                  type="email"
                  name="user_email"
                  placeholder="عنوان البريد الإلكتروني"
                  className="w-full rounded-lg p-2 outline-none shadow-none focus:border-primary border-secondary tex-lg sm:text-xl placeholder:text-sm placeholder:sm:text-lg"
                />
              </div>
            </div>
            <div className="flex flex-col items-center w-full">
              <label className="tex-lg sm:text-xl my-2 text-white p-2 ">
                الرسالة:
              </label>
              <textarea
                value={userInfo?.message}
                placeholder={placeholderText}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, message: e.target.value })
                }
                required
                name="message"
                className="w-full rounded-lg p-2 outline-none shadow-none focus:border-primary border-secondary tex-lg sm:text-xl min-h-[200px] placeholder:text-sm placeholder:sm:text-lg"
              />
            </div>
            <div>
              <Button title={'إرسال'} type="submit" style={' '} />
            </div>
          </form>
        )}
      </div>{' '}
    </>
  );
};
