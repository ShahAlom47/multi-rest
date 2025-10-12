// src/components/DashProtectedWrapper.tsx
"use client";

import React, { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface DashProtectedWrapperProps {
  children: ReactNode;
  allowedRoles: string[]; // কোন role access পাবে
}

const DashProtectedWrapper: React.FC<DashProtectedWrapperProps> = ({ children, allowedRoles }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;

  if (!session?.user || !allowedRoles.includes(session.user.role || "")) {
    router.push("/login");
    return null;
  }

  return <>{children}</>;
};

export default DashProtectedWrapper;
