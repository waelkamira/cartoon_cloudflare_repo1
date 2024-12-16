'use client';
import React, { useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import CurrentUser from '../CurrentUser';
import Image from 'next/image';
import { TbArrowBigLeftLinesFilled } from 'react-icons/tb';
import { FaCheck } from 'react-icons/fa';

// Stripe Plans >> fill in your own priceId & link
export const plans = [
  {
    link:
      process.env.NODE_ENV === 'development'
        ? 'https://buy.stripe.com/test_3cs00Y2SS1No9zybII'
        : '',
    priceId:
      process.env.NODE_ENV === 'development'
        ? 'price_1QKLFkGuuuUL2td5xMyNAvua'
        : '',
    price: 1,
    duration: '/شهر',
  },
  {
    link:
      process.env.NODE_ENV === 'development'
        ? 'https://buy.stripe.com/test_28o5lidxw2Rs7rq3cd'
        : '',
    priceId:
      process.env.NODE_ENV === 'development'
        ? 'price_1QKMnIGuuuUL2td5WLUCAnCV'
        : '',

    price: 10,
    duration: '/سنة',
  },
];

const Pricing = () => {
  const { data: session } = useSession();
  const [plan, setPlan] = useState(plans[0]);
  const user = CurrentUser();

  useEffect(() => {
    handlePlanPrice(plan?.price);
  }, [plan?.price]);
  //هذه الدالة لتخزين قيمة الخطة المدفوعة لأننا سوف نحتاج هذه القيمة في الباك اند لتعديل حقول monthly_subscribed monthly_subscribed_date
  // أو yearly_subscribed yearly_subscribed_date
  // على حسب القيمة
  async function handlePlanPrice(price) {
    const response = await fetch('/api/user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...user, plan_price: price }),
    });
  }
  return (
    <>
      <section id="pricing" className="bg-white text-sm">
        <div className="py-2 px-8 max-w-5xl mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <p className="font-medium text-primary mb-5">الاشتراك</p>
            <h2 className="font-bold text-3xl lg:text-5xl tracking-tight">
              مرحباً أصدقاء بهيجة أشرق لبن{' '}
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
          <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
            <div className=" w-full max-w-lg">
              <div className="relative flex flex-col h-full gap-5 lg:gap-8 z-10 bg-base-100 p-2 rounded-xl">
                <div className="flex-col sm:flex-row items-center gap-8">
                  <h1 className="p-2">اختر نوع الاشتراك:</h1>
                  <div
                    className={
                      (plan?.price === 1
                        ? 'border-green-400'
                        : 'border-white') +
                      ' flex items-start justify-start gap-2 border  rounded-lg p-2 my-2 cursor-pointer'
                    }
                    onClick={() => setPlan(plans[0])}
                  >
                    {' '}
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
                      checked={plan.price === 1}
                    />
                    <span>اشتراك شهري</span>
                  </div>
                  <div
                    className={
                      (plan?.price === 10
                        ? 'border-green-400'
                        : 'border-white') +
                      ' flex items-start justify-start gap-2 border  rounded-lg p-2 my-2 cursor-pointer'
                    }
                    onClick={() => setPlan(plans[1])}
                  >
                    {' '}
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
                      <span className="w-full ">اشتراك سنوي (خصم 16% 💰)</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-2 w-full bg-gray-200 p-2 rounded-lg">
                  <p className={`text-5xl tracking-tight font-extrabold`}>
                    ${plan.price}
                  </p>
                  <div className="flex flex-col justify-end mb-[4px]">
                    <p className="text-sm tracking-wide text-base-content/80 uppercase font-semibold">
                      {plan.duration}
                    </p>
                  </div>
                </div>
                <div className="w-full text-center">
                  <a
                    className=" w-full text-lg px-12 rounded-md text-center hover:scale-150 h-10"
                    href={
                      plan.link + '?prefilled_email=' + session?.user?.email
                    }
                  >
                    <h1 className="btn rounded-lg p-1"> اشتراك</h1>{' '}
                  </a>
                </div>
                <ul className="space-y-2.5 leading-relaxed flex-1 w-full text-sm p-4  border border-green-300 rounded-lg">
                  {[
                    { name: 'مشاهدة أفلام كرتون قديمة و حديثة' },
                    {
                      name: 'مشاهدة بدون إعلانات',
                    },
                    { name: ' مشاهدة أفلام ديزني وبكسار بجودة عالية' },
                    { name: 'كرتون مدبلج باحترافية' },
                    { name: 'رفع دوري لأحدث الأفلام والمسلسلات الكرتونية' },
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div>
                        <FaCheck className="text-green-400 text-sm" />
                      </div>

                      <span>{feature.name} </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Pricing;
