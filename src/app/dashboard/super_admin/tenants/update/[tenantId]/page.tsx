"use client";

import TenantForm from "@/components/DashboardComponets/TenantForm";
import { TenantData, TenantFormData } from "@/Interfaces/tenantInterface";
import { getTenantById, updateTenantById } from "@/lib/allApiRequest/tenantRequest";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";


const EditTenant = () => {
const router = useRouter();
  const params = useParams();
  const tenantId = params.tenantId;
  console.log(tenantId);

  const { data, isLoading, error } = useQuery<TenantData>({
    queryKey: ["tenant", tenantId],
    queryFn: async ({ queryKey }) => {
      // derive the id from the queryKey to ensure it's treated as a string
      const id = queryKey[1] as string;
      const res = await getTenantById(id);
      return res?.data as TenantData || null;
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

  const handleUpdateTenant = async (updatedData: TenantFormData) => {
  
    if (!tenantId) {
      console.error("Tenant ID is missing, cannot update tenant.");
      return;
    }
    const res = await updateTenantById(data?.tenantId || '', updatedData);
    console.log(res)
    if (res.success) {
      toast.success(res.message || "Tenant updated successfully");
      router.push ('/dashboard/super_admin/tenants');
    } else {
      toast.error(res.message || "Failed to update tenant");
    } 
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
