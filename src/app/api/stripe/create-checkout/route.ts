/* eslint-disable no-console */
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { createCheckoutSession } from '@/lib/stripeSubscription';

export async function POST(req: NextRequest) {
 
  const body = await req.json();
  const { priceId, mode, successUrl, cancelUrl, couponId } = body;

  try {
    // Generate a unique clientReferenceId
    const clientReferenceId = uuidv4();

    let finalPriceId = priceId;
    let finalMode = mode;


    // Use the donation ID as clientReferenceId for the checkout session
    const checkoutSession = await createCheckoutSession(
      finalPriceId,
      finalMode,
      successUrl,
      cancelUrl,
      clientReferenceId,
      couponId
    );

    if (!checkoutSession.url) {
      throw new Error('Checkout session URL is missing');
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error('Detailed error in create-checkout handler:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error.message },
      { status: 500 }
    );
  }
}
