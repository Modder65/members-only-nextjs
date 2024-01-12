"use client"

import { RegisterForm } from "@/components/auth/register-form";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifyInvite } from "@/actions/verify-invite";
import { toast } from "sonner";

const RegisterPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  
  useEffect(() => {
    verifyInvite(token)
      .then((data) => {
        if (data?.error) {
          toast.error(data.error);
          router.push("/auth/login");
        }

        if (data?.success) {
          toast.success(data.success);
        }
      })
  }, [token, router]);

  
  return (
    <RegisterForm />
  );
};

export default RegisterPage;
