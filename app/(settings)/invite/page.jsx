"use client";

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


const InvitePage = () => {
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

  return ( 
    <Card className="max-w-3xl w-full shadow-md">
      <CardHeader>
        <p className="text-2xl font-bold text-center">
          Invite
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRoles={[UserRole.OWNER, UserRole.USER]}>
          <div className="flex flex-col sm:flex-row items-center justify-between
          rounded-lg border p-3 shadow-md gap-y-2 sm:gap-y-0 sm:gap-x-2">
            <p className="text-sm font-bold">
              Email
            </p>
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col sm:flex-row items-center gap-y-2 sm:gap-y-0 sm:gap-x-2 w-full"
              >
                <FormField 
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input 
                          {...field}
                          placeholder="johndoe@example.com"
                          type="email"
                          disabled={isPending}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending} className="flex-shrink-0">
                  Send
                </Button>
              </form>
            </Form>
          </div>
        </RoleGate>
      </CardContent>
    </Card>
   );
}
 
export default InvitePage;