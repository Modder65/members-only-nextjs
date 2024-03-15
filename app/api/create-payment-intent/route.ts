import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  const user = await currentUser();

  const { amount } = await req.json();

  try {
    // Create Payment Intents from body params
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // convert to cents
      currency: "usd",
      payment_method_types: ["card", "us_bank_account", "cashapp"],
      receipt_email: user.email,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    return NextResponse.json({ status: "Failed",  message: err.message });
  }
}

