"use client";

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";

export default function DonateSuccess() {
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
