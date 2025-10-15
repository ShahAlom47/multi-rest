import { TenantData } from '@/Interfaces/tenantInterface';
import { getAllTenants } from '@/lib/allApiRequest/tenantRequest';
import React from 'react';

const Tenants = async () => {
  try {
    // 🧭 Default query parameters
    const params = {
      currentPage: 1,
      limit: 10,
      search: "",
      sort: "createdAt-desc",
      isDashboardRequest: true, // optional
    };

    const allTenantRes = await getAllTenants(params);
    const allTenant = allTenantRes?.data as TenantData[];

    console.log("All Tenants Response:", allTenantRes)

    if (!allTenantRes?.success || !allTenant) {
      return <div className="text-center text-red-500">Error fetching data</div>;
    }

    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Tenant Management</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allTenant.map((tenant: TenantData) => (
            <div
              key={tenant._id}
              className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition"
            >
              <h3 className="text-lg font-medium">{tenant.name}</h3>
              <p className="text-sm text-gray-600">Email: {tenant.email}</p>
              <p className="text-sm text-gray-600">Status: {tenant.status}</p>
              <p className="text-sm text-gray-600">Created At: {tenant.createdAt?.toString()}</p>
            </div>
          ))}
        </div>
      </div>
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching tenants:", error);
    return (
      <div className="text-center text-red-500">
        Failed to load tenants: {error.message || "Unknown error"}
      </div>
    );
  }
};

export default Tenants;
