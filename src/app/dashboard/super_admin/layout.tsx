// src/app/dashboard/super_admin/layout.tsx
import DashNavbar from "@/components/DashboardComponets/DashNavbar";
import DashProtectedWrapper from "@/WrapperComponets/DashProtectedWrapper";
import React from "react";

export default function SuperAdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     <DashProtectedWrapper allowedRoles={["super_admin"]}>
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 font-bold">
       <DashNavbar role="super_admin" />
      </header>
      <main className="p-4">{children}</main>
    </div>
    </DashProtectedWrapper>
  );
}
