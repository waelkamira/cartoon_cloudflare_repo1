import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
export const runtime = 'edge';

// إعداد Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL1, // عنوان URL الخاص بـ Supabase
  process.env.NEXT_PUBLIC_SUPABASE_API1 // مفتاح API العمومي الخاص بـ Supabase
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');
  let data;
  let eventType;
  let event;

  // verify Stripe event is legit
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed. ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  data = event.data;
  eventType = event.type;

  try {
    switch (eventType) {
      case 'checkout.session.completed': {
        const session = await stripe.checkout.sessions.retrieve(
          data.object.id,
          {
            expand: ['line_items'],
          }
        );
        const customerId = session?.customer;
        const customer = await stripe.customers.retrieve(customerId);

        if (customer.email) {
          try {
            const now = new Date();
            const formattedDate =
              now.getUTCFullYear() +
              '-' +
              String(now.getUTCMonth() + 1).padStart(2, '0') +
              '-' +
              String(now.getUTCDate()).padStart(2, '0') +
              ' ' +
              String(now.getUTCHours()).padStart(2, '0') +
              ':' +
              String(now.getUTCMinutes()).padStart(2, '0') +
              ':' +
              String(now.getUTCSeconds()).padStart(2, '0') +
              '.' +
              String(now.getUTCMilliseconds()).padStart(3, '0') +
              '000+00';

            let price;
            try {
              let { data: User, error } = await supabase
                .from('User')
                .select('plan_price')
                .eq('email', customer.email)
                .single();

              if (error) throw error;
              price = User ? User.plan_price : null;
            } catch (error) {
              console.error('Error fetching plan price:', error);
              price = null;
            }

            const { data: user, error } = await supabase
              .from('User')
              .update(
                price === 1
                  ? {
                      monthly_subscribed: true,
                      monthly_subscribed_date: formattedDate,
                    }
                  : {
                      yearly_subscribed: true,
                      yearly_subscribed_date: formattedDate,
                    }
              )
              .eq('email', customer.email);

            if (error) throw error;

            // إعادة التوجيه إلى الصفحة الرئيسية
            return NextResponse.redirect('http://cartoonz.top', 302);
          } catch (error) {
            console.error('Error updating user:', error);
            return new Response(
              JSON.stringify({ error: 'Internal Server Error' }),
              { status: 500 }
            );
          }
        } else {
          console.error('No user found');
          throw new Error('No user found');
        }

        break;
      }

      default:
      // Unhandled event type
    }
  } catch (e) {
    console.error('stripe error: ' + e.message + ' | EVENT TYPE: ' + eventType);
  }

  return NextResponse.json({});
}
