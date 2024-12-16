import axios from 'axios';
export const runtime = 'edge';

async function generateAccessToken() {
  const response = await axios({
    url: `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
    method: 'post',
    data: 'grant_type=client_credentials',
    auth: {
      username: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      password: process.env.PAYPAL_CLIENT_SECRET,
    },
  });

  return response.data.access_token;
}

export async function POST(req) {
  try {
    const { plan, userEmail } = await req.json(); // الحصول على الخطة والبريد الإلكتروني

    const accessToken = await generateAccessToken();

    const orderData = {
      intent: 'CAPTURE',
      application_context: {
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
        brand_name: 'Your Brand Name',
      },
      payer: {
        email_address: userEmail || 'default@example.com',
        address: {
          postal_code: '12345',
          country_code: 'US',
        },
      },
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: plan === 1 ? '1.00' : '10.00', // تحديد السعر بناءً على الخطة
          },
        },
      ],
    };

    const response = await axios({
      url: `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(orderData),
    });

    return new Response(JSON.stringify({ id: response.data.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return new Response('Error creating order', { status: 500 });
  }
}
