'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../components/Button';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import CustomToast from '../../components/CustomToast';
import { useEffect } from 'react';

export default function LogInPage() {
  const session = useSession();
  // console.log(session?.data?.user?.name);
  const router = useRouter();
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(),
  });
  // {
  //   "version": 2,
  //   "builds": [
  //     { "src": "package.json", "use": "@vercel/node" },
  //     { "src": "next.config.js", "use": "@vercel/next" }
  //   ]
  // }

  const {
    register,
    getValues,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  //! و ضعنا هذه الجملة الشرطية هنا لانه عندما يقوم المستخدم بتسجيل الدخول عن طريق جوجل مثلا
  //! أو احد البروفايدرز يتم انشاء جلسة اي ان عملية تسجيل الدخول صحيحة وبالتالي نقوم باعادة توجيه المستخدم الى الصفحة الرئيسية
  //! التطبيق build حتى لاتسبب مشكلة عند  useEffect يجب وضع الجملة الشرطية هذه ضمن

  useEffect(() => {
    if (session?.data?.user?.email) {
      router.push('/');
    }
  }, [router, session?.data?.user?.email]);

  async function onSubmit() {
    if (getValues()?.email === '') {
      setError('email', {
        type: 'custom',
        message: 'عنوان البريد الإلكتروني مطلوب',
      });
      return;
    } else if (getValues()?.password?.length < 5) {
      setError('password', {
        type: 'custom',
        message:
          'طول كلمة السر يجب أن يكون 5 أحرف (أو 5 أرقام وأحرف) على الأقل',
      });
      return;
    }
    // console.log('getValues', getValues());

    const response = await signIn('credentials', {
      ...getValues(),
      redirect: false,
      callbackUrl: '/',
    });

    if (response.ok) {
      const values = getValues();

      localStorage.setItem('email', values?.email);
      // localStorage.setItem('password', values?.password);
      router.push('/');
      toast.custom((t) => (
        <CustomToast
          t={t}
          message={' بهيجة اشرق لبن ترحب بكم أهلا وسهلا '}
          emoji={'🧀'}
          greenEmoji={'🧀'}
        />
      ));
    } else {
      setError(response?.error);
      toast.custom((t) => (
        <CustomToast
          t={t}
          message={
            'عنوان البريد الالكتروني هذا غير موجود يجب عليك التسجيل أولا 😐'
          }
        />
      ));
    }
  }

  return (
    <div className="flex justify-center items-center w-full h-screen text-white text-lg md:text-xl text-end">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full lg:w-1/2 bg-four p-8 rounded-lg border border-one"
      >
        <h1 className="w-full my-2 text-xl sm:text-2xl md:text-3xl xl:text-4xl font-bold text-center select-none">
          تسجيل الدخول 🧀
        </h1>

        <div className="relative flex flex-col items-start justify-center w-full">
          <h1 className="w-full my-4 select-none text-start text-sm sm:text-lg">
            البريد الإلكتروني
          </h1>
          <input
            type="text"
            name={'email'}
            placeholder="الإيميل"
            {...register('email')}
            className=" placeholder-gray-400 transition-all placeholder:text-sm placeholder:sm:text-lg duration-300 grow py-2 border-2 border-gray-300 border-solid focus:border-2 focus:outline-one outline-none rounded-md px-2 w-full caret-one text-black text-start"
          />
        </div>
        {errors?.email && (
          <h1 className="text-one text-md my-2 select-none">
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
            className=" placeholder-gray-400 placeholder:text-sm placeholder:sm:text-lg transition-all duration-300 grow py-2 border-2 border-gray-300 border-solid focus:border-2 focus:outline-one outline-none rounded-md px-2 w-full caret-one text-black text-start"
          />
        </div>
        {errors?.password && (
          <h1 className="text-one text-md my-2 select-none">
            {errors?.password?.message}
          </h1>
        )}
        <div
          className="flex justify-center w-full bg-white rounded-md px-4 py-2 items-center my-8 hover:shadow-md cursor-pointer"
          onClick={() => signIn('google')}
        >
          <div className="relative h-8 w-8 ">
            <Image
              priority
              src={'/google.png'}
              alt="google image"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <h1 className="text-sm sm:text-lg grow text-center text-gray-500 select-none font-semibold">
            تسجيل الدخول عن طريق جوجل
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-8 items-center mt-4 w-full">
          <button
            type="submit"
            className=" text-lg p-2  my-3 text-white text-nowrap bg-five hover:bg-one rounded-lg hover:scale-[101%] w-full "
          >
            تسجيل الدخول
          </button>

          <div className="w-full">
            <Link href={'/'}>
              <button
                type="submit"
                className=" text-lg p-2  my-3 text-white text-nowrap bg-five hover:bg-one rounded-lg hover:scale-[101%] w-full "
              >
                إغلاق{' '}
              </button>{' '}
            </Link>
          </div>
        </div>
        <Link href={'/register'}>
          <h1 className="mt-4 text-start text-sm sm:text-lg">
            ليس لديك حساب؟ قم بالتسجيل
            <span className="text-one text-lg sm:text-xl hover:scale-105">
              🧀 هنا
            </span>
          </h1>
        </Link>
      </form>
    </div>
  );
}
