// src/app/dashboard/rider/layout.tsx
import DashProtectedWrapper from "@/WrapperComponets/DashProtectedWrapper";
import React from "react";

export default function RiderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashProtectedWrapper allowedRoles={["rider"]}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-orange-600 text-white p-4 font-bold">
          Rider Dashboard
        </header>
        <main className="p-4">{children}</main>
      </div>
    </DashProtectedWrapper>
  );
}

