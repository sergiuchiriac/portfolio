import { NextResponse } from 'next/server';
import type { Stripe } from 'stripe';

import stripe from '@/lib/stripeSubscription';
import { Resend } from 'resend';
import PurchaseEmailTemplate from '@/components/emails/purchase-email-template';

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const rawBody = await req.text();
  try {
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        req.headers.get('stripe-signature') as string,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (err! instanceof Error) console.log(err);
      console.log(`❌ Error message: ${errorMessage}`);
      return NextResponse.json(
        { message: `Webhook Error: ${errorMessage}` },
        { status: 400 }
      );
    }

    // Successfully constructed event.
    // console.log('✅ Success:', event.id);

    const permittedEvents: string[] = [
      'checkout.session.completed',
      'payment_intent.succeeded',
      'invoice.payment_succeeded',
      'payment_intent.payment_failed',
      'customer.subscription.deleted',
      'invoice.payment_failed',
      'customer.subscription.updated',
    ];

    if (permittedEvents.includes(event.type)) {
      let data;

      try {
        switch (event.type) {
          case 'checkout.session.completed':
            data = event.data.object as Stripe.Checkout.Session;
            console.log(`💰 CheckoutSession status: ${data.payment_status}`);
            console.log('checkout.session.completed', { data });

            if (data.client_reference_id) {
              try {

                // Method 1: Try client_reference_id first
                if (data?.client_reference_id) {
                  console.log(
                    'Attempting to find user with client_reference_id:',
                    data?.client_reference_id
                  );

                  // Send purchase confirmation email
                  const { data: emailData, error } = await resend.emails.send({
                    from: "Sergiu Chiriac <support@thedirectori.es>",
                    to: data.customer_details?.email ?? "",
                    subject: "Purchase Confirmed!",
                    html: PurchaseEmailTemplate({
                      email: data.customer_details?.email ?? "",
                      amount: data.amount_total ?? 0,
                    }),
                  })

                  console.log('User found by client_reference_id:', data.customer_details?.email);
                }

              } catch (error) {
                console.log('Error updating user credits:', {
                  error,
                  clientReferenceId: data.client_reference_id,
                  customerEmail: data.customer_details?.email,
                  stripeCustomerId: data.customer,
                });
              }
            }

            break;
          case 'invoice.payment_succeeded': {
            const invoice = event.data.object as Stripe.Invoice;

            console.log(`💰 payment_succeeded status: ${invoice}`);
            console.log({
              data: JSON.stringify(invoice),
            });

            // You might need additional checks here to ensure this invoice is for a subscription
            if (invoice.billing_reason === 'subscription_cycle') {
              const stripeCustomerId = invoice.customer as string;

              // Send purchase confirmation email
              const { data: emailData, error } = await resend.emails.send({
                from: "ColdConvert <sergiu@engage.coldconvert.ai>",
                to: invoice.customer_email ?? "",
                subject: "Purchase Confirmed!",
                html: PurchaseEmailTemplate({
                  email: invoice.customer_email ?? "",
                  amount: invoice.amount_paid ?? 0,
                }),
              })

            }
            break;
          }
          case 'payment_intent.payment_failed': {
            data = event.data.object as Stripe.PaymentIntent;
            const customerId = data.customer as string;

            console.log(
              `❌ Payment failed: ${data.last_payment_error?.message}`
            );
            console.log({
              '❌ Payment failed:': JSON.stringify(data),
              customerId,
            });
            break;
          }
          case 'payment_intent.succeeded':
            data = event.data.object as Stripe.PaymentIntent;
            // eslint-disable-next-line no-case-declarations
            const stripeCustomerId = data.customer as string;
            console.log(`💰 PaymentIntent status: ${data.status}`);
            console.log('Failed payment is now a success for', {
              stripeCustomerId,
            });
            console.log({
              message: 'PaymentIntent succeeded prob should do something??',
              data: JSON.stringify(data),
            });
            break;
          default:
            throw new Error(`Unhandled event: ${event.type}`);
        }
      } catch (error) {
        console.log(error);
        return NextResponse.json(
          { message: 'Webhook handler failed' },
          { status: 500 }
        );
      }
    }

    // Return a response to acknowledge receipt of the event.
    return NextResponse.json(
      {
        message: 'Received',
      },
      { status: 200 }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return NextResponse.json(
      {
        message: 'something went wrong',
        ok: false,
      },
      { status: 500 }
    );
  }
}
