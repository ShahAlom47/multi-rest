// src/app/dashboard/user/layout.tsx
import DashProtectedWrapper from "@/WrapperComponets/DashProtectedWrapper";
import React from "react";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashProtectedWrapper allowedRoles={["user"]}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-purple-600 text-white p-4 font-bold">
          User Dashboard
        </header>
        <main className="p-4">{children}</main>
      </div>
    </DashProtectedWrapper>
  );
}
