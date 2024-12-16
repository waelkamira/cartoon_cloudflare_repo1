'use client';

import { loadScript } from '@paypal/paypal-js';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import CurrentUser from '../CurrentUser';
import { TbArrowBigLeftLinesFilled } from 'react-icons/tb';
import { inputsContext } from '../Context';
import PaymentSuccess from '../../app/payment-success/page';

const PayPalButton = ({ plan }) => {
  const user = CurrentUser(); // الحصول على بيانات المستخدم
  const router = useRouter();
  // console.log('plan button', plan);
  const { dispatch, rerender } = useContext(inputsContext);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    const container = document.getElementById('paypal-button-container');

    if (!container) {
      console.error('PayPal container not found.');
      return;
    }
    // إزالة الأزرار القديمة
    container.innerHTML = '';
    loadScript({
      'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      components: 'buttons',
      currency: 'USD',
      locale: 'ar_EG', // Use Arabic locale for translated UI
    })
      .then((paypal) => {
        if (paypal && user) {
          paypal
            .Buttons({
              createOrder: async () => {
                try {
                  const response = await fetch('/api/paypal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      plan: plan?.price, // إرسال قيمة الخطة المختارة
                      userEmail: user?.email, // إرسال بريد المستخدم
                      intent: 'CAPTURE',
                      application_context: {
                        shipping_preference: 'NO_SHIPPING', // تعطيل حقول الشحن
                        brand_name: 'Your Brand Name', // تخصيص اسم العلامة التجارية
                        user_action: 'PAY_NOW', // عرض زر "Pay Now" مباشرة
                      },
                    }),
                  });

                  if (!response.ok) throw new Error('Failed to create order');
                  // if (response.ok) {
                  //   dispatch({ type: 'PLAN', payload: plan });
                  // }
                  const order = await response.json();
                  return order.id;
                } catch (error) {
                  console.error('Error creating order:', error);
                  throw error;
                }
              },
              //عند نجاح عملية الدفع
              onApprove: async (data, actions) => {
                try {
                  const capture = await actions.order.capture();
                  console.log('Payment successful:', capture);

                  setSuccess(true);
                } catch (error) {
                  console.error('Error capturing payment:', error);
                }
              },
              onError: (error) => {
                console.error('PayPal Button Error:', error);
              },
            })
            .render('#paypal-button-container');
        }
      })
      .catch((error) => {
        console.error('Failed to load PayPal script:', error);
      });
  }, [plan, rerender]);

  useEffect(() => {
    handlePlanPrice(plan?.price);
  }, [plan?.price, rerender]);
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
    <div>
      <div id="paypal-button-container" className="paypal-container ">
        {' '}
      </div>
      {success && <PaymentSuccess plan={plan} />}
    </div>
  );
};

export default PayPalButton;
