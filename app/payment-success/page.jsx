'use client';
import { useContext, useEffect } from 'react';
import Button from '../../components/Button';
import CurrentUser from '../../components/CurrentUser';
import { useRouter } from 'next/navigation';
import { inputsContext } from '../../components/Context';
import LoadingPhoto from '../../components/LoadingPhoto';
import Image from 'next/image';
import toast from 'react-hot-toast';
import CustomToast from '../../components/CustomToast';
export default function PaymentSuccess({ plan }) {
  const user = CurrentUser();
  // console.log('user', user);
  const router = useRouter();
  const { dispatch, rerender } = useContext(inputsContext);

  useEffect(() => {
    if (user) {
      console.log('plan PaymentSuccess', plan);
      console.log('user PaymentSuccess', user);
      updateUserSubscription();
    }
  }, [user]);

  async function updateUserSubscription() {
    const date = new Date();
    // استخراج الأجزاء المختلفة للتاريخ
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // الأشهر تبدأ من 0
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
    // بناء سلسلة التاريخ
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}+00`;
    // console.log(formattedDate);
    // console.log('date', date);
    const response = await fetch('/api/user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...user,
        email: user?.email,
        image: user?.image,
        name: user?.name,
        plan_price: plan?.price,
        monthly_subscribed: plan?.price === 1 ? true : false,
        monthly_subscribed_date: plan?.price === 1 ? formattedDate : null,
        yearly_subscribed: plan?.price === 1 ? false : true,
        yearly_subscribed_date: plan?.price === 1 ? null : formattedDate,
      }),
    });
    if (response.ok) {
      // dispatch({ type: 'RERENDER' });
      console.log('subscribed');

      // router.push('/');
      toast.custom((t) => (
        <CustomToast
          t={t}
          greenEmoji={'✔'}
          message={`تم تفعيل اشتراكك بنجاح لمدة ${plan?.subscription_period} يوماً`}
        />
      ));
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window?.location?.reload();
        }
      }, 3000);
    }
  }

  return;
  /*<main className="fixed flex-col justify-end items-end  w-full h-full bg-white z-50 overflow-y-auto top-0 text-center">
      <div className="absolute top-0 z-50 p-8 w-full min-h-52 overflow-y-auto">
        <div className="relative flex justify-center h-44 w-full text-center">
          <Image   loading="lazy"

            src={'https://i.imgur.com/nfDVITC.png'}
            layout="fill"
            objectFit="contain"
            alt="photo"
          />
        </div>
        <h1 className="text-2xl font-extrabold">
          تم تفعيل اشتراكك{' '}
          <span className="text-one">{plan?.subscription_period}</span> يوماً!
        </h1>
        <div className="my-4">
          <LoadingPhoto />
        </div>
        <Button title={'عودة للصفحة الرئيسية'} path={'/'} />
      </div>
    </main> */
  <div></div>;
}
