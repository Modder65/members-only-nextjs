"use client";

import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import axios from "axios";
import Link from "next/link";

export default function DonateSuccess() {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    const stripeReturn = async () => {
      try {
        const response = await axios.get(`/api/checkout-session?session_id=${sessionId}`);
        setStatus(response.data.status);
      } catch (error) {
        console.error("Error fetching session:", error.response?.data || error.message);
      }
    }

    stripeReturn();
  }, []);

  if (status === 'open') {
    return (
      redirect('/')
    )
  }

  if (status === 'complete') {
    return (
      <div className="flex justify-center mt-8 max-w-3xl w-full mx-auto px-5">
        <Card className="max-w-3xl w-full">
          <CardHeader>
            <CardTitle className='text-2xl font-bold text-center'>Payment succeeded. We appreciate your donation!</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button><Link href="/users">Return Home</Link></Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null;
}