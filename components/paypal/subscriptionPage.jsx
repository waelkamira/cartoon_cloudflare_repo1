'use client';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import { TbArrowBigLeftLinesFilled } from 'react-icons/tb';
import PaypalButton from './paypalButton';
import SubscribedOrNot from './subscribedOrNot';
import CurrentUser from '../CurrentUser';
import { FaCheck } from 'react-icons/fa6';
import { inputsContext } from '../Context';
import { SiAdguard } from 'react-icons/si';
import { SiAdblock } from 'react-icons/si';
import { BsTv } from 'react-icons/bs';

export const plans = [
  {
    price: 1,
    duration: '/شهر',
    subscription_period: 30,
  },
  {
    price: 10,
    duration: '/سنة',
    subscription_period: 365,
  },
];

export default function SubscriptionPage() {
  const [plan, setPlan] = useState(plans[0]);
  const subscribed = SubscribedOrNot();
  const user = CurrentUser();
  const { dispatch } = useContext(inputsContext);

  //   console.log('subscribed', subscribed);
  //   console.log('user', user);
  useEffect(() => {
    checkUser();
  }, []);
  function checkUser() {
    dispatch({ type: 'RERENDER' });
  }
  return (
    <>
      {!subscribed &&
        user?.monthly_subscribed === false &&
        user?.yearly_subscribed === false && (
          <div className="fixed flex-col justify-center items-center w-full h-full bg-white z-40 overflow-y-auto top-0 pb-24 text-center">
            <div className="absolute border top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full sm:w-1/3 p-4 overflow-y-auto">
              <div className="flex flex-col text-center w-full mb-12">
                <p className="font-medium text-primary mb-5">الاشتراك</p>
                <h2 className="font-bold text-3xl lg:text-5xl tracking-tight">
                  مرحباً أصدقاء بهيجة أشرق لبن
                </h2>
              </div>
              <div className="relative flex justify-center h-44 w-full text-center">
                <Image
                  loading="lazy"
                  src={'https://i.imgur.com/nfDVITC.png'}
                  layout="fill"
                  objectFit="contain"
                  alt="photo"
                />
              </div>
              <h1 className="text-center my-8">يجب عليك الاشتراك للمتابعة</h1>
              <h1>اختر نوع الاشتراك</h1>
              <div
                className={
                  (plan?.price === 1 ? 'border-[#8FEA2F]' : 'border-white') +
                  ' flex items-start justify-start gap-2 border  rounded-lg p-2 my-2 cursor-pointer'
                }
                onClick={() => setPlan(plans[0])}
              >
                <TbArrowBigLeftLinesFilled
                  className={
                    plan?.price === 1
                      ? 'text-one animate-pulse'
                      : 'text-white animate-pulse'
                  }
                />
                <input
                  type="checkbox"
                  name="monthly"
                  className="radio "
                  checked={plan?.price === 1}
                />
                <span>اشتراك شهري</span>
              </div>
              <div
                className={
                  (plan?.price === 10 ? 'border-green-400' : 'border-white') +
                  ' flex items-start justify-start gap-2 border rounded-lg p-2 my-2 cursor-pointer'
                }
                onClick={() => setPlan(plans[1])}
              >
                <TbArrowBigLeftLinesFilled
                  className={
                    plan?.price === 10
                      ? 'text-one animate-pulse '
                      : 'text-white animate-pulse'
                  }
                />
                <input
                  type="checkbox"
                  name="yearly"
                  className="radio"
                  checked={plan.price === 10}
                />
                <div>
                  <span className="w-full mb-4">اشتراك سنوي (خصم 16% 💰)</span>
                </div>
              </div>
              <div className="flex justify-center gap-2 w-full p-2 rounded-lg mb-4">
                <p className={`text-5xl tracking-tight font-extrabold`}>
                  ${plan.price}
                </p>
                <div className="flex flex-col justify-end mb-[4px]">
                  <p className="text-sm tracking-wide text-base-content/80 uppercase font-semibold">
                    {plan.duration}
                  </p>
                </div>
              </div>
              <PaypalButton plan={plan} />
              <div className="flex text-sm my-4 mt-8 border border-[#8FEA2F] rounded-lg p-2">
                <div className="flex-col justify-center items-center w-full">
                  <SiAdguard className="text-green-400 text-center w-full text-xl" />

                  <h1 className="">محتوى أمن</h1>
                </div>
                <div className="flex-col justify-center items-center w-full">
                  <BsTv className="text-green-400 text-center w-full text-xl" />

                  <h1 className="">دقة عالية</h1>
                </div>
                <div className="flex-col justify-center items-center w-full">
                  <SiAdblock className="text-green-400 text-center w-full text-xl" />

                  <h1 className="">بدون إعلانات</h1>
                </div>
              </div>

              <ul className="space-y-2.5 leading-relaxed flex-1 w-full text-sm p-2 my-4 border border-[#8FEA2F] rounded-lg text-start">
                {[
                  { name: 'مشاهدة أفلام الكرتون القديمة و الحديثة' },
                  {
                    name: 'مشاهدة بدون إعلانات',
                  },
                  { name: ' مشاهدة أفلام ديزني وبكسار بجودة عالية' },
                  { name: 'كرتون مدبلج باحترافية' },
                  { name: 'رفع دوري لأحدث الأفلام والمسلسلات الكرتونية' },
                  { name: 'بالإضافة إلى كرتون باللغة الإنجليزية و التركية' },
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div>
                      <FaCheck className="text-green-500 text-sm" />
                    </div>

                    <span>{feature.name} </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
    </>
  );
}
