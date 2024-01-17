"use client";

import { useState, useTransition } from "react";
import { FaUser } from "react-icons/fa";
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardContent,
  CardListItem,
} from "@/components/ui/card";
import {
  Form, 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { UserRole } from "@prisma/client";
import { SearchUserSchema } from "@/schemas";
import { searchUser } from "@/actions/search-user";
import { toast } from "sonner";

const ManageUsers = () => {
  const [userData, setUserData] = useState(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(SearchUserSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values) => {
    startTransition(() => {
      searchUser(values)
        .then((data) => {
          if (data?.error) {
            setUserData(null); // Clear previous user data
            form.reset();
            toast.error(data.error);
          }

          if (data) {
            setUserData(data.user); // Clear previous user data
            form.reset();
          }
        })
        .catch(() => toast.error("Something went wrong!"))
    });
  }

  return (    
    <Card className="w-[600px] shadow-md">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">
        👥 Manage Users
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <div className="flex flex-col gap-y-2">
            <FormSuccess message="You are allowed to see this content!"/>
            <div className="flex flex-row items-center justify-between
            rounded-lg border p-3 shadow-md mb-5">
              <p className="text-sm font-medium">
                Search User
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
                    Search
                  </Button>
                </form>
              </Form>
              
            </div>
            <div>
              {userData && (
                <Card className="">
                  <CardListItem className="flex flex-row items-center gap-x-2 w-full">
                    <Avatar>
                      <AvatarImage src={userData?.image || ""}/>
                      <AvatarFallback className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
                from-green-400 to-green-800">
                        <FaUser className="text-white"/>
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p>{userData.name}</p>
                      <p className="truncate max-w-[30%]">{userData.email}</p>
                    </div>
                  </CardListItem>
                </Card>
              )}
            </div>
          </div>
        </RoleGate>
      </CardContent>
    </Card>
   );
}
 
export default ManageUsers;