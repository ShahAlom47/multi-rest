// src/app/dashboard/super_admin/tenants/[tenantId]/edit/page.tsx
"use client";

import TenantForm from "@/components/DashboardComponets/TenantForm";
import { TenantFormData } from "@/Interfaces/tenantInterface";
import React, { useEffect, useState } from "react";

interface EditTenantProps {
  params: { tenantId: string };
}

const EditTenant = ({ params }: EditTenantProps) => {
  const [initialValues, setInitialValues] = useState<TenantFormData | null>(null);

  useEffect(() => {
    // TODO: Fetch tenant data by params.tenantId
    // Example:
    setInitialValues({
      name: "Restaurant One",
      slug: "restaurantone",
      email: "owner@example.com",
      phone: "017XXXXXXXX",
      domain: "orders.restaurantone.com",
      logoUrl: "",
      status: "active",
    });
  }, [params.tenantId]);

  const handleUpdateTenant = (data: TenantFormData) => {
    console.log("Update Tenant Data:", data);
    // TODO: API call to update tenant
  };

  if (!initialValues) return <p>Loading...</p>;

  return (
    <div className="p-4 max-w">
      <h1 className="text-2xl font-bold mb-4">Edit Restaurant</h1>
      <TenantForm initialValues={initialValues} onSubmit={handleUpdateTenant} />
    </div>
  );
};

export default EditTenant;
