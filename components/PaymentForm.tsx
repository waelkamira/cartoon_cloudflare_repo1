'use client';

import { useEffect, useState } from 'react';
import braintree, { HostedFields } from 'braintree-web';

export default function PaymentForm() {
  const [hostedFields, setHostedFields] = useState<HostedFields | null>(null);

  async function handlePayment(event: React.FormEvent) {
    event.preventDefault();
    if (!hostedFields) return;
    try {
      const { nonce } = await hostedFields.tokenize();
      const data = {
        nonce,
        id: 10000,
        quantity: 1,
      };
      const res = await fetch(`/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      alert('Payment Successful!');
    } catch (err) {
      console.log(err);
      alert('Payment failed. Please try again.');
    }
  }

  useEffect(() => {
    async function initializeBraintree() {
      try {
        const res = await fetch('/api/braintree-client-token', {
          cache: 'no-store',
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message);

        const clientInstance = await braintree.client.create({
          authorization: result.clientToken,
        });

        const hostedFields = await braintree.hostedFields.create({
          fields: {
            number: {
              selector: '#card_number', // تأكد من أن العنصر موجود في الـ DOM
              placeholder: '4111 1111 1111 1111',
            },
            ...(process.env.BRAINTREE_ENVIRONMENT === 'Production' && {
              cvv: {
                selector: '#cvv',
                placeholder: '123',
              },
            }),
            expirationDate: {
              selector: '#expiration_date', // تأكد من أن العنصر موجود في الـ DOM
              placeholder: 'MM/YY',
            },
          },
          client: clientInstance,
        });

        setHostedFields(hostedFields);
      } catch (err) {
        console.log(err);
      }
    }
    initializeBraintree();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handlePayment}
        className="bg-white p-8 rounded-lg shadow-lg w-96 space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          Payment Details
        </h2>

        <div>
          <label
            htmlFor="card_number"
            className="block text-gray-600 font-medium mb-2"
          >
            Card Number
          </label>
          <div id="card_number" className="border p-3 rounded-md"></div>{' '}
          {/* Make sure this element exists */}
        </div>

        {process.env.BRAINTREE_ENVIRONMENT === 'Production' && (
          <div>
            <label
              htmlFor="cvv"
              className="block text-gray-600 font-medium mb-2"
            >
              CVV
            </label>
            <div id="cvv" className="border p-3 rounded-md"></div>{' '}
            {/* Make sure this element exists */}
          </div>
        )}

        <div>
          <label
            htmlFor="expiration_date"
            className="block text-gray-600 font-medium mb-2"
          >
            Expiration Date
          </label>
          <div id="expiration_date" className="border p-3 rounded-md"></div>{' '}
          {/* Make sure this element exists */}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
          >
            Pay Now
          </button>
        </div>
      </form>
    </div>
  );
}
