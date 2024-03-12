import { NextResponse } from "next/server";
import { Stripe } from "stripe";
import prisma from "@/lib/prismadb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event | null = null;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    switch (event?.type) {
      case "checkout.session.completed":
        // Triggered when a checkout session has been successfully completed
        // Crucial for confirming a successful donation 
        // Use this event to update database with donation
        // details, send thank you emails to donors, and 
        // trigger any post-donation processes
        const session = event.data.object as Stripe.Checkout.Session;
        
        try {
          await prisma.donation.create({
            data: {
              email: session.customer_details?.email,
              amount: session.amount_total,
              currency: session.currency,
              payment_status: 'succeeded',
              stripe_session_id: session.id,
            }
          });
        } catch (err) {
          console.error("Error saving donation to database:", err);
        }
        
        break;
      case "payment_intent.succeeded": 
        // Triggered when a payment intent has been successfully completed
        // While checkout.session.completed is often sufficient for
        // donations via checkout, listening to this eventn gives a more
        // granular view of the payments success. It's useful if
        // you're using Payment Intents API directly for more complex flows 
        break;
      case "payment_intent.payment_failed": 
         // Triggered when a payment attempt fails 
         // For handling failed donation attempts
         // Use this information to reach out to the donor
         // to attempt to resolve the issue or log failed 
         // attempts for follow-up
        break;
      default:
        // other events that we don't handle
        break;
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return NextResponse.json({ message: err.message }, { status: 400 });
    }
  }
  return NextResponse.json({ received: true });
}