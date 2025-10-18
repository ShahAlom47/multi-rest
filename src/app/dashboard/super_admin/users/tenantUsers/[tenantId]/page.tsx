"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getAllTenantUsers } from "@/lib/allApiRequest/userRequest";
import { Loader2 } from "lucide-react";
import PrimaryButton from "@/components/PrimaryButton";

const TenantUsers = () => {
  const { tenantId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["tenantUsers", tenantId],
    queryFn: async () => {
      const res = await getAllTenantUsers(tenantId as string);
      return res?.data;
    },
    enabled: !!tenantId,
  });
console.log(data)
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-gray-500 w-10 h-10" />
      </div>
    );
  }

  const adminInfo = data?.adminInfo;
  const users = data?.users || [];
  const totalUsers = data?.pagination?.totalUsers || users.length;

  return (
    <div className="p-6 space-y-6">
      {/* ---------- Header Section ---------- */}
      <div className="bg-white p-5 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-2">Tenant Overview</h2>
        <div className="text-gray-700 space-y-1">
          <p><strong>Tenant ID:</strong> {tenantId}</p>
          <p><strong>Total Users:</strong> {totalUsers}</p>
          <p><strong>Admin Name:</strong> {adminInfo?.name}</p>
          <p><strong>Admin Email:</strong> {adminInfo?.email}</p>
          <p><strong>Admin Role:</strong> {adminInfo?.role}</p>
        </div>
      </div>

      {/* ---------- Users Section ---------- */}
      <div className="grid md:grid-cols-3 gap-5">
        {users.map((user: any) => (
          <div key={user._id} className="shadow-md border rounded-xl">
            <div className="p-4 border-b">
              <h1 className="text-lg">{user.name}</h1>
            </div>
            <div className="p-4">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p>
                <strong>Status:</strong>{" "}
                {user.isActive ? (
                  <span className="text-green-600 font-medium">Active</span>
                ) : (
                  <span className="text-red-500 font-medium">Inactive</span>
                )}
              </p>
              <p><strong>Verified:</strong> {user.isVerified ? "Yes" : "No"}</p>
              <PrimaryButton  className="mt-3">
                Change Role
              </PrimaryButton>
            </div>  
          </div>
        ))}
      </div>

      {/* ---------- Pagination ---------- */}
      {data?.pagination?.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <PrimaryButton
            disabled={data.pagination.currentPage <= 1}
            onClick={() => console.log("Prev page")}
          >
            Prev
          </PrimaryButton>
          <span>
            Page {data.pagination.currentPage} of {data.pagination.totalPages}
          </span>
          <PrimaryButton
            disabled={
              data.pagination.currentPage >= data.pagination.totalPages
            }
            onClick={() => console.log("Next page")}
          >
            Next
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};

export default TenantUsers;
