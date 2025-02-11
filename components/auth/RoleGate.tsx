"use client"

import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";
import { UserRole } from "@prisma/client";
import FormError from "../FormError";

export default function RoleGate({ 
  children, 
  allowedRole 
}: { 
  children: React.ReactNode, 
  allowedRole: UserRole 
}) {
  const role = useCurrentUserRole();

  if(role !== allowedRole) {
    return <FormError message="You are not authorized to access this page" />
  }

  return children;
} 