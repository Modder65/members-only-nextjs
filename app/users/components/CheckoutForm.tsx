import { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { StripePaymentElementOptions } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/use-current-user';
import Link from "next/link";

export const CheckoutForm = () => {
  const user = useCurrentUser();
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded");
          break;
        case "processing":
          setMessage("Payment processing");
          break;
        case "requires_payment_method":
          setMessage("Payment requires confirmation");
          break;
        default: 
          setMessage("Something went wrong");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://members-only.blog/users/donate-success",
      }
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.")
    }
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "tabs",
    defaultValues: {
      billingDetails: {
        name: user.name,
        email: user.email,
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement options={paymentElementOptions}/>
      <Button type="submit" className="w-full mt-5" disabled={isLoading || !stripe || !elements}>
        Donate
      </Button>
      <p className='text-center mt-5'>Powered by <Link href="https://stripe.com/" target='_blank' className='font-bold text-skin-link-accent hover:text-skin-link-accent-hover'>Stripe</Link></p>
      {message && <div>{message}</div>}
    </form>
  );
};