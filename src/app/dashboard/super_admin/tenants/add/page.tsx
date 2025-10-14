// src/app/dashboard/super_admin/tenants/add/page.tsx
"use client";

import TenantForm from "@/components/DashboardComponets/TenantForm";
import { TenantFormData } from "@/Interfaces/tenantInterface";
import { createTenant } from "@/lib/allApiRequest/tenantRequest";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

const AddTenants = () => {
  const router = useRouter();
  const handleAddTenant = async (data: TenantFormData) => {
    console.log("Add Tenant Data:", data);
    const res = await createTenant(data);

    console.log("API Response:", res);
    if (res.success) {
      toast.success(res.message || "Tenant added successfully");
      router.push("/dashboard/super_admin/tenants");
    } else {
      toast.error(res.message || "Failed to add tenant");
    }
    // TODO: API call to add tenant
  };

  return (
    <div className="p-4 max-w ">
      <h1 className="text-2xl font-bold mb-4">Add New Restaurant</h1>
      <TenantForm onSubmit={handleAddTenant} />
    </div>
  );
};

export default AddTenants;
