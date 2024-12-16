'use client';
import { useContext, useEffect, useState } from 'react';
import CurrentUser from '../CurrentUser';
import { inputsContext } from '../Context';

export default function SubscribedOrNot() {
  const [Subscribed, setSubscribed] = useState(false); // الافتراض أنه غير مشترك
  const user = CurrentUser(); // الحصول على بيانات المستخدم
  const { rerender, dispatch, check_subscription } = useContext(inputsContext);

  // وظيفة للتحقق من حالة الاشتراك
  const checkSubscriptionStatus = (startDate, daysLimit) => {
    const currentDate = new Date();
    const subscriptionDate = new Date(startDate);
    // console.log('subscriptionDate', subscriptionDate);
    const daysSinceSubscription =
      (currentDate - subscriptionDate) / (1000 * 60 * 60 * 24);
    // console.log('daysSinceSubscription', daysSinceSubscription);

    return daysSinceSubscription <= daysLimit;
  };

  // تحديث اشتراك المستخدم في قاعدة البيانات
  async function updateUserSubscription() {
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...user,
          email: user?.email,
          image: user?.image,
          name: user?.name,
          monthly_subscribed: false,
          yearly_subscribed: false,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update subscription status');
      }
      console.log('Subscription status updated successfully');
    } catch (error) {
      console.error('Error updating subscription status:', error);
    }
  }
  useEffect(() => {
    if (user) {
      const currentDate = new Date();
      const createdAtDate = new Date(user?.createdAt);

      const daysSinceAccountCreated =
        (currentDate - createdAtDate) / (1000 * 60 * 60 * 24);

      if (
        !user?.monthly_subscribed &&
        !user?.yearly_subscribed &&
        daysSinceAccountCreated <= 1
      ) {
        console.log('user', 'مشترك تجريبي');
        setSubscribed(true);
      } else if (user?.monthly_subscribed) {
        if (checkSubscriptionStatus(user?.monthly_subscribed_date, 30)) {
          console.log('user', 'مشترك شهري');
          setSubscribed(true);
        } else {
          console.log('user', 'انتهى الاشتراك الشهري');
          setSubscribed(false);
          updateUserSubscription();
        }
      } else if (user?.yearly_subscribed) {
        if (checkSubscriptionStatus(user?.yearly_subscribed_date, 365)) {
          console.log('user', 'مشترك سنوي');
          setSubscribed(true);
        } else {
          console.log('user', 'انتهى الاشتراك السنوي');
          setSubscribed(false);
          updateUserSubscription();
        }
      } else {
        console.log('user', 'غير مشترك');
        setSubscribed(false);
      }
    }
  }, [user, rerender, check_subscription]);

  return Subscribed;
}
