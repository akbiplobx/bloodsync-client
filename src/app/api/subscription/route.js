import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic'; 

export async function POST(req) {
  try {
    const headersList = await headers();
    const origin = headersList.get('origin');
    
    
    const userSession = await auth.api.getSession({
      headers: headersList,
    });
    
    const user = userSession?.user;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const PRICE_ID = "price_1TlvB0LbGttKKIrEvqEXsIH6";

    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email,
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      metadata: {
        priceId: PRICE_ID,
        userId: user?.id,
        userEmail: user?.email,
      },
      mode: "subscription",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/funding`,
    });

    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}