// src/app/dashboard/admin/layout.tsx
import DashNavbar from "@/components/DashboardComponets/DashNavbar";
import DashProtectedWrapper from "@/WrapperComponets/DashProtectedWrapper";
import React from "react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashProtectedWrapper allowedRoles={["admin", "super_admin", "user", "rider"]}>
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white p-4 font-bold">
       <DashNavbar role="admin" />
      </header>
      <main className="p-4">{children}</main>
    </div>
    </DashProtectedWrapper>
  );
}
