/* eslint-disable no-console */
import 'server-only';

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Stripe Secret Key is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createDynamicPrice(amount: number, mode: string) {
  try {
    console.log('Creating dynamic price with amount:', amount, 'mode:', mode);

    const priceData: Stripe.PriceCreateParams = {
      currency: 'usd',
      unit_amount: Math.round(amount * 100), // Convert to cents
      product_data: {
        name: 'Custom Donation',
      },
    };

    if (mode === 'subscription') {
      priceData.recurring = {
        interval: 'month',
      };
    }

    const price = await stripe.prices.create(priceData);
    
    console.log('Dynamic price created:', price);
    return {
      id: price.id,
      mode: mode as 'payment' | 'subscription'
    };
  } catch (error) {
    console.error('Error creating dynamic price:', error);
    throw error;
  }
}

export async function createCheckoutSession(
  priceId: string,
  mode: string,
  successUrl: string,
  cancelUrl: string,
  clientReferenceId: string,
  couponId: string
) {
  if (!['payment', 'subscription'].includes(mode)) {
    throw new Error(`Invalid mode: ${mode}`);
  }

  try {
    console.log('Creating checkout session with params:', {
      priceId,
      clientReferenceId,
      mode,
      successUrl,
      cancelUrl,
      couponId
    });

    const extraParams: Partial<Stripe.Checkout.SessionCreateParams> = {};

    if (mode === 'payment') {
      extraParams.customer_creation = 'always';
      extraParams.invoice_creation = { enabled: true };
      extraParams.payment_intent_data = { setup_future_usage: 'on_session' };
    }
    extraParams.tax_id_collection = { enabled: true };

    const stripeSession = await stripe.checkout.sessions.create({
      mode: mode as 'payment' | 'subscription',
     // allow_promotion_codes: true, // Enable promotion codes
      client_reference_id: clientReferenceId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      discounts: couponId
      ? [
          {
            coupon: couponId,
          },
        ]
      : [],
      success_url: successUrl,
      cancel_url: cancelUrl,
      ...extraParams,
    });

    console.log('Checkout session created:', stripeSession);
    return stripeSession;
  } catch (error) {
    console.error('Error creating Stripe session:', {
      error,
      priceId,
      mode,
      successUrl,
      cancelUrl,
      clientReferenceId,
    });
    throw error; // Re-throw the error so it can be caught in the API route
  }
}

export default stripe;
