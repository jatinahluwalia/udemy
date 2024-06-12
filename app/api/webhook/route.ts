import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Purchase from '@/lib/models/purchase.model';

export const POST = async (req: NextRequest) => {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SCRET,
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 },
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const { userId, courseId } = session?.metadata as any;

  if (event.type === 'checkout.session.completed') {
    if (!userId || !courseId) {
      return NextResponse.json({ error: 'Webhook Error: Missing metadata' });
    }
    await Purchase.create({ courseId, userId });
  } else {
    return NextResponse.json(
      { error: `Unhandled event type ${event.type}` },
      { status: 200 },
    );
  }
  return NextResponse.json(null, { status: 200 });
};
