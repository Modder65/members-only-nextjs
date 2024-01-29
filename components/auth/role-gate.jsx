"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { FormError } from "@/components/form-error";

export const RoleGate = ({
  children,
  allowedRoles
}) => {
  const role = useCurrentRole(); 

  if (!allowedRoles.includes(role)) {
    return (
      <FormError message="You do not have permission to view this content!"/>
    );
  }

  return (
    <>
      {children}
    </>
  );
};