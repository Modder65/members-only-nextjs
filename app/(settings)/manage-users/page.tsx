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
  FormMessage,
} from "@/components/ui/form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RoleGate } from "@/components/auth/role-gate";
import { UserRole } from "@prisma/client";
import { SearchUserSchema } from "@/schemas";
import { searchUser } from "@/actions/search-user";
import { toast } from "sonner";
import { autoCompleteUserEmail } from "@/actions/auto-complete-useremail";
import { deleteUser } from "@/actions/delete-user";
import { changeRole } from "@/actions/change-role";
import { useCurrentUser } from "@/hooks/use-current-user";
import { PublicUserInfo } from "@/types/types";
import * as z from "zod";



const ManageUsers = () => {
  const [autocompleteResults, setAutocompleteResults] = useState<string[]>([]);
  const [userData, setUserData] = useState<PublicUserInfo | null>(null);
  const [isPending, startTransition] = useTransition();

  const user = useCurrentUser();
  const isOwner = user?.role === "OWNER";

  const form = useForm<z.infer<typeof SearchUserSchema>>({
    resolver: zodResolver(SearchUserSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof SearchUserSchema>) => {
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

  const onDelete = (userId: string) => {
    deleteUser(userId)
      .then((data) => {
        setUserData(null);
      })
  };

  const fetchAutocompleteResults = async (partialEmail: string) => {
    if (partialEmail.length > 2) { // To avoid too many requests
      try {
        const emails = await autoCompleteUserEmail(partialEmail);
        setAutocompleteResults(emails);
      } catch (error) {
        console.error("Failed to fetch autocomplete results", error);
        toast.error("Failed to fetch autocomplete results");
        setAutocompleteResults([]);
      }
    } else {
      setAutocompleteResults([]);
    }
  };
  

  const submitForm = form.handleSubmit(onSubmit);

  const selectEmail = (email: string) => {
    form.setValue('email', email); // Update the email field with the selected email
    setAutocompleteResults([]); // Optionally, clear the autocomplete results
    submitForm(); 
  };

  const roleChange = (userId: string, newRole: string) => {
    changeRole(userId, newRole)
      .then((data) => {
        toast.success(`User Role Updated: ${newRole}`);
      })
  };

  // Disable role changer if an Admin tries to change another admins role
  const shouldDisableRoleSelector = (userData: PublicUserInfo): boolean => {
    return user.role === "ADMIN" && userData.role === "ADMIN";
  };

  // Filter role options based on current user's role and selected user's role
  // Admins can only change a users role to banned or user
  const getRoleOptions = (userData: PublicUserInfo): UserRole[] => {
    if (isOwner) {
      return Object.values(UserRole);
    } else if (user.role === "ADMIN" && userData.role === "USER") {
      return [UserRole.USER, UserRole.BANNED];
    }
    return [];
  };
  
  // Utility function to format role for display
  const formatRole = (role: UserRole): string => {
    const roleMap: Record<UserRole, string> = {
      [UserRole.OWNER]: "Owner",
      [UserRole.ADMIN]: "Admin",
      [UserRole.USER]: "User",
      [UserRole.BANNED]: "Banned"
    };

    return roleMap[role] || role;
  };

  return (    
    <Card className="max-w-3xl w-full shadow-md">
      <CardHeader>
        <p className="text-2xl font-bold text-center">
          Manage Users
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRoles={[UserRole.OWNER, UserRole.ADMIN]}>
          <div className="flex flex-col gap-y-2">
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
                            onChange={(e) => {
                              field.onChange(e); // existing change handler
                              fetchAutocompleteResults(e.target.value); // new autocomplete handler
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isPending} className="flex-shrink-0">
                    Search
                  </Button>
                </form>
              </Form>
              
            </div>
            <div>
              {autocompleteResults && autocompleteResults.length > 0 && (
                <Card className="mb-5">
                {autocompleteResults.map((email, index) => (
                  <CardListItem key={index} className="autocomplete-result cursor-pointer hover:opacity-60" onClick={() => selectEmail(email)}>
                    {email}
                  </CardListItem>
                ))}
                </Card>
              )}
              {userData && (
                <Card className="">
                  <CardListItem className="flex flex-col sm:flex-row items-center justify-between w-full">
                    <div className="flex flex-row items-center gap-x-2">
                      <Avatar>
                        <AvatarImage src={userData?.image || ""}/>
                        <AvatarFallback className="bg-skin-fill">
                          <FaUser className="text-white"/>
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p>{userData.name}</p>
                        <p className="truncate max-w-[60%]">{userData.email}</p>
                      </div>
                    </div>
                    <AlertDialog>
                      <div className="flex flex-row sm:flex-col items-center gap-x-2 sm:gap-x-0 sm:gap-y-2">
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" disabled={!isOwner}>Delete User</Button>
                        </AlertDialogTrigger>
                        <Select 
                          defaultValue={userData.role}
                          onValueChange={(selectedRole) => roleChange(userData.id, selectedRole)}
                          disabled={shouldDisableRoleSelector(userData)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={userData.role}/>
                          </SelectTrigger>
                          <SelectContent>
                            {getRoleOptions(userData).map((role) => (
                              <SelectItem key={role} value={role}>
                                {formatRole(role)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this users
                            account and remove their data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(userData.id)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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