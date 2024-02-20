"use client";

import * as z from "zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { RoleGate } from "@/components/auth/role-gate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form, 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner";
import { UserRole } from "@prisma/client";
import { InvitationSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { invite } from "@/actions/invite";


const OwnerPage = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(InvitationSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values) => {
    startTransition(() => {
      invite(values)
        .then((data) => {
          if (data?.error) {
            form.reset();
            toast.error(data.error);
          }

          if (data?.success) {
            form.reset();
            toast.success(data.success);
          }
        })
        .catch(() => toast.error("Something went wrong!"))
    });
  }

  const onAPiRouteClick = () => {
    fetch("/api/admin")
      .then((response) => {
        if (response.ok) {
          toast.success("Allowed API Route!");
        } else {
          toast.error("Forbidden API Route!");
        }
      })
  }

  return ( 
    <Card className="max-w-3xl w-full">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">
          Owner
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRoles={[UserRole.OWNER, UserRole.USER]}>
          <div className="flex flex-row items-center justify-between
          rounded-lg border p-3 shadow-md">
            <p className="text-sm font-medium">
              Send Invitation Link
            </p>
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-row items-center gap-x-2"
              >
                <FormField 
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          {...field}
                          placeholder="johndoe@example.com"
                          type="email"
                          disabled={isPending}
                          className="w-[300px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending}>
                  Send
                </Button>
              </form>
            </Form>
            
          </div>

          <div className="flex flex-row items-center justify-between
          rounded-lg border p-3 shadow-md">
            <p className="text-sm font-medium">
              Admin-Only API Route
            </p>
            <Button onClick={onAPiRouteClick}>
              Click to test
            </Button>
          </div>
        </RoleGate>
      </CardContent>
    </Card>
   );
}
 
export default OwnerPage;