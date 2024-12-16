'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../components/Button';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import CustomToast from '../../components/CustomToast';
import { useEffect } from 'react';
import { TbDoorEnter } from 'react-icons/tb';

export default function RegisterPage() {
  const session = useSession();
  const router = useRouter();
  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(),
  });

  const {
    register,
    getValues,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  //! اذا تم التسجيل بنجاح عن طريق أحد البروفايدرز سوف يتم توجيه المستخدم الى صفحة تسجيل الدخول
  //! التطبيق build حتى لاتسبب مشكلة عند  useEffect يجب وضع الجملة الشرطية هذه ضمن

  useEffect(() => {
    if (session?.data?.user?.email) {
      router.push('/login');
    }
  }, [router, session?.data?.user?.email]);

  async function onSubmit() {
    console.log('getValues', getValues);
    try {
      const response = await fetch('/api/register', {
        // method: 'POST',
        // headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify({ ...getValues }), // القيمة التي ترسلها
      });

      const data = await response.json();

      if (!response.ok) {
        // عند حدوث خطأ من الباك إند
        console.error('Error:', data.message); // رسالة الخطأ المرسلة من الباك إند
        setError('email', {
          type: 'manual',
          message: data.message || 'حدث خطأ غير معروف!',
        });
        return;
      }

      // إذا كانت الاستجابة ناجحة
      toast.success('تم التحقق من البريد الإلكتروني بنجاح!');
    } catch (error) {
      // في حال حدوث أخطاء أخرى
      console.error('Unexpected error:', error);
      setError('email', {
        type: 'manual',
        message: 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة لاحقًا.',
      });
    }
  }

  return (
    <div className="flex justify-center items-center w-full h-screen text-white text-lg md:text-xl text-end">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full lg:w-1/2 bg-four p-8 rounded-lg border border-one"
      >
        <h1 className="flex justify-center mb-16 w-full my-2 text-xl sm:text-2xl md:text-3xl xl:text-4xl font-bold text-center select-none">
          التسجيل <TbDoorEnter className="text-3xl" />
        </h1>
        <div className="relative flex justify-center h-44 w-full text-center">
          <Image
            loading="lazy"
            src={'https://i.imgur.com/nfDVITC.png'}
            layout="fill"
            objectFit="contain"
            alt="photo"
          />
        </div>
        <div className="flex flex-col items-start justify-center w-full">
          <h1 className="w-full my-4 select-none text-start text-sm sm:text-lg">
            اسم المستخدم
          </h1>
          <input
            type="text"
            name={'name'}
            placeholder="الإسم"
            {...register('name')}
            className=" placeholder-gray-400 transition-all duration-300 placeholder:text-sm placeholder:sm:text-lg grow py-2 border-2 border-gray-300 border-solid focus:border-2 focus:outline-one outline-none rounded-md px-2 w-full caret-one text-black text-start"
          />
        </div>
        {errors?.name && (
          <h1 className="text-white text-md my-2 text-start">
            {errors?.name?.message}
          </h1>
        )}
        <div className="relative flex flex-col items-start justify-center w-full">
          <h1 className="w-full my-4 select-none text-start text-sm sm:text-lg">
            البريد الإلكتروني
          </h1>
          <input
            type="text"
            name={'email'}
            placeholder="الإيميل"
            {...register('email')}
            className=" placeholder-gray-400 transition-all duration-300 placeholder:text-sm placeholder:sm:text-lg grow py-2 border-2 border-gray-300 border-solid focus:border-2 focus:outline-one outline-none rounded-md px-2 w-full caret-one text-black text-start"
          />
        </div>
        {errors?.email && (
          <h1 className="text-white text-md my-2 text-start">
            {errors?.email?.message}
          </h1>
        )}
        <div className="relative flex flex-col items-start justify-center w-full">
          <h1 className="w-full my-4 select-none text-start text-sm sm:text-lg">
            كلمة السر
          </h1>
          <input
            type="password"
            name={'password'}
            placeholder="كلمة السر"
            {...register('password')}
            className=" placeholder-gray-400 transition-all duration-300 placeholder:text-sm placeholder:sm:text-lg grow py-2 border-2 border-gray-300 border-solid focus:border-2 focus:outline-one outline-none rounded-md px-2 w-full caret-one text-black text-start"
          />
        </div>
        {errors?.password && (
          <h1 className="text-white text-md my-2 text-start">
            {errors?.password?.message}
          </h1>
        )}
        <div
          className="flex justify-between w-full bg-white rounded-md gap-4 px-4 py-2 items-center my-8 hover:shadow-md cursor-pointer"
          onClick={() =>
            signIn('google', {
              redirect: false, // يمنع التنقل الكامل
              callbackUrl: '/',
            })
          }
        >
          <div className="relative h-8 w-8">
            <Image
              loading="lazy"
              src={'https://i.imgur.com/Z4ts3yl.png'}
              alt="google image"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <h1 className="text-sm sm:text-lg grow text-center text-gray-500 select-none font-semibold">
            التسجيل عن طريق جوجل
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-center mt-4 w-full">
          <button
            type="submit"
            className=" text-lg p-2 shadow-lg my-3 text-white text-nowrap bg-five hover:bg-one rounded-lg hover:scale-[101%] w-full "
          >
            تسجيل
          </button>

          <div className="w-full">
            <Link href={'/'}>
              <button
                type="submit"
                className=" text-lg p-2 shadow-lg my-3 text-white text-nowrap bg-five hover:bg-one rounded-lg hover:scale-[101%] w-full "
              >
                إغلاق{' '}
              </button>{' '}
            </Link>
          </div>
        </div>
        <Link href={'/login'}>
          {' '}
          <h1 className="flex mt-4 text-start text-sm sm:text-lg underline">
            لديك حساب؟ قم بتسجيل الدخول
            <TbDoorEnter className="text-xl mx-1 animate-pulse" />
            هنا
          </h1>
        </Link>
      </form>
    </div>
  );
}
