// src/app/dashboard/super_admin/tenants/add/page.tsx
"use client";

import TenantForm from "@/components/DashboardComponets/TenantForm";
import {   TenantFormData } from "@/Interfaces/tenantInterface";
import React from "react";

const AddTenants = () => {
  const handleAddTenant = (data: TenantFormData) => {
    console.log("Add Tenant Data:", data);
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
