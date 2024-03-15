"use client";

import { useState } from "react";
import {  Appearance, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "../components/CheckoutForm";
import axios from "axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 

const Donate = () => {
  const [stripePromise, setStripePromise] = useState(() => loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY));
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(0);

  const createPaymentIntent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post("/api/create-payment-intent", { amount: amount * 100 }); // convert to cents
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      console.log(error);
    }
  }

  const colorFill = getComputedStyle(document.body).getPropertyValue("--color-fill").trim();
  const colorIconAccent = getComputedStyle(document.body).getPropertyValue("--color-icon-accent").trim();
  const colorIconAccentHover = getComputedStyle(document.body).getPropertyValue("--color-icon-accent-hover").trim();

  const appearance: Appearance = {
    theme: "stripe",
    variables: { 
      tabIconColor: colorIconAccent,
      tabIconHoverColor: colorIconAccentHover,
      tabIconSelectedColor: colorIconAccent,
    },
    rules: {
      '.Tab--selected': {
        borderColor: colorFill,
      }
    }
  };

  return ( 
    
      
    
    <div className="flex justify-center mt-8 max-w-3xl w-full mx-auto px-5">
      {!clientSecret && (
        <Card className="max-w-3xl w-full">
          <CardHeader>
            <h1 className="text-center text-3xl font-bold">Donate</h1>
          </CardHeader>
          <CardContent>
            <form onSubmit={createPaymentIntent} className="flex gap-x-2 justify-center">
            <label htmlFor="donationAmount">Enter donation amount in dollars (e.g., 5 for five dollar)</label>
            <Input id="donationAmount" type="number" value={amount} onChange={e => setAmount(parseInt(e.target.value))} placeholder="Enter donation amount in dollars (e.g., 5 for five dollar)" />
              <Button type="submit">Donate</Button>
            </form>
          </CardContent>
        </Card>
      )}
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret: clientSecret, appearance:  appearance}}>
          <Card>
            <CardHeader>
              <h1 className="text-center text-3xl font-bold">Donate</h1>
            </CardHeader>
            <CardContent>
              <CheckoutForm  />
            </CardContent>
          </Card>
        </Elements>
      )}
    </div>
   );
}
 
export default Donate;