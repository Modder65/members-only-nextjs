"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Donate = () => {
  const [clientSecret, setClientSecret] = useState<string>("");

  useEffect(() => {
    const checkout = async () => {
      try {
        const response = await axios.post("/api/checkout-session");
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.log(error);
      }
    }

    checkout();
  }, []);
  
  return ( 
    <div className="flex justify-center mt-8 max-w-3xl w-full mx-auto px-5">
      {clientSecret && (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{clientSecret}}
        >
          <EmbeddedCheckout className="w-full"/>
        </EmbeddedCheckoutProvider>
      )}
    </div>
   );
}
 
export default Donate;