// 'use client';

// import CheckoutPage from '../../components/checkout/CheckoutPage';
// import convertToSubcurrency from '../../components/checkout/convertToSubcurrency';
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';

// if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
//   throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined');
// }
// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
// );

// export default function Pay() {
//   const amount = 1;

//   return (
//     <main
//       className="max-w-6xl mx-auto p-4 h-screen text-white text-center bg-gray-500 "
//       target="_blank"
//     >
//       <div className="mb-10">
//         <h1 className="text-3xl font-extrabold mb-2">كرتون بهيجة أشرق لبن</h1>
//         <h2 className="text-2xl">
//           شراء بسكوتة بقيمة <span className="font-bold"> ${amount}</span>
//         </h2>
//         <h2 className="text-xl mt-2"> ( اشتراك لمدة شهر ) </h2>
//       </div>

//       <Elements
//         stripe={stripePromise}
//         options={{
//           mode: 'payment',
//           amount: convertToSubcurrency(amount),
//           currency: 'usd',
//         }}
//       >
//         <CheckoutPage amount={amount} />
//       </Elements>
//     </main>
//   );
// }

import ButtonCustomerPortal from '../../components/stripeCheckout/ButtonCustomerPortal';
import Pricing from '../../components/stripeCheckout/Pricing';

export default function Page() {
  return (
    <>
      <header className="p-4 flex justify-end max-w-7xl mx-auto bg-white">
        <ButtonCustomerPortal />
      </header>

      <main className="bg-base-200 min-h-screen">
        <Pricing />
      </main>
    </>
  );
}
