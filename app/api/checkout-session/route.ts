import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST() {
  const user = await currentUser();

  try {
    // Create Checkout Sessions from body params
    const session = await stripe.checkout.sessions.create({
      // Define what forms fields/options you want, prefill user data, etc.
      ui_mode: 'embedded',
      customer_email: user.email,
      submit_type: 'donate',
      payment_method_types: [
        'cashapp',
        'card',
        'us_bank_account'
      ],
      // billing_address_collection: 'auto',
      // shipping_address_collection: {
      //   allowed_countries: ['US', 'CA'],
      // },
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of
          // the product you want to sell
          price: process.env.STRIPE_ITEM_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      //redirect_on_completion: 'never',
      return_url:
        `https://members-only.blog/users/donate-success?session_id={CHECKOUT_SESSION_ID}`,
        //automatic_tax: {enabled: true},
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err) {
    return NextResponse.json({ status: "Failed",  message: err.message });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({ status: session.status });
  } catch (err) {
    return NextResponse.json({ status: "Failed", err });
  }
}
