"use client";

import TenantForm from "@/components/DashboardComponets/TenantForm";
import { TenantFormData } from "@/Interfaces/tenantInterface";
import { getTenantById } from "@/lib/allApiRequest/tenantRequest";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";


const EditTenant = () => {

  const params = useParams();
  const tenantId = params.tenantId;
  console.log(tenantId);

  const { data, isLoading, error } = useQuery<TenantFormData>({
    queryKey: ["tenant", tenantId],
    queryFn: async ({ queryKey }) => {
      // derive the id from the queryKey to ensure it's treated as a string
      const id = queryKey[1] as string;
      const res = await getTenantById(id);
      return res?.data as TenantFormData || null;
    },
    // only run the query when tenantId is available
    enabled: !!tenantId,
  });
console.log(data)
  const [initialValues, setInitialValues] = useState<TenantFormData | null>(null);

  // Set initialValues when query data arrives
  useEffect(() => {
    if (data) {
      setInitialValues(data);
    }
  }, [data]);

  const handleUpdateTenant = (updatedData: TenantFormData) => {
    console.log("Update Tenant Data:", updatedData);
    // TODO: Call API to update tenant
  };

  if (!tenantId) return <p className="text-red-500">Tenant ID not found.</p>;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Failed to load tenant data.</p>;
  if (!initialValues) return null; // just in case

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Restaurant</h1>
      <TenantForm initialValues={initialValues} onSubmit={handleUpdateTenant} />
    </div>
  );
};

export default EditTenant;
