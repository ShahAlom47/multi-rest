"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changeUserRole,
  getAllTenantUsers,
} from "@/lib/allApiRequest/userRequest";
import PrimaryButton from "@/components/PrimaryButton";
import { TenantUsersResponse } from "@/Interfaces/userManagementInterfaces";
import Loading from "@/app/loading";
import { ObjectId } from "mongodb";
import toast from "react-hot-toast";

export type UserRole = "user" | "admin" | "rider" | "super_admin";

const TenantUsers: React.FC = () => {
  const { tenantId } = useParams();
  const queryClient = useQueryClient();
  const [changingRoleId, setChangingRoleId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");

  const { data, isLoading } = useQuery<TenantUsersResponse>({
    queryKey: ["tenantUsers", tenantId],
    queryFn: async () => {
      const res = await getAllTenantUsers(tenantId as string);
      return res?.data as TenantUsersResponse;
    },
    enabled: !!tenantId,
  });

  const handleRoleChange = async (userId: string | ObjectId | undefined) => {
    if (!selectedRole || !userId) return toast.error("Please select a role");
    try {
      setChangingRoleId(userId.toString());
      const res = await changeUserRole(userId, selectedRole);
      if (res?.success) {
        toast.success(res?.message || "User role changed successfully!");
        await queryClient.invalidateQueries({ queryKey: ["tenantUsers", tenantId] }); // refetch
      } else {
        toast.error(res?.message || "Failed to change role");
      }
    } catch  {
      toast.error("Something went wrong!");
    } finally {
      setChangingRoleId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loading />
      </div>
    );
  }

  if (!data) return <p className="text-center text-red-500">No data found</p>;

  const { tenantInfo, adminInfo, users, pagination } = data;

  return (
    <div className="p-6 space-y-8">
      {/* ---------- Header Section ---------- */}
      <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">{tenantInfo.tenantName}</h2>
          <p className="text-gray-600">
            <strong>Tenant ID:</strong> {tenantInfo.tenantId}
          </p>
          <p className="text-gray-600">
            <strong>Status:</strong> {tenantInfo.tenantStatus}
          </p>
          <p className="text-gray-600">
            <strong>Tenant Total Users:</strong> {data?.tenantUserCount}
          </p>
        </div>
        {adminInfo && (
          <div className="bg-gray-50 p-4 rounded-xl shadow-inner w-full md:w-auto">
            <h3 className="font-semibold text-lg mb-1">Admin Info</h3>
            <p>
              <strong>Name:</strong> {adminInfo.name}
            </p>
            <p>
              <strong>Email:</strong> {adminInfo.email}
            </p>
            <p>
              <strong>Role:</strong> {adminInfo.role}
            </p>
          </div>
        )}
      </div>

      {/* ---------- Users Section ---------- */}
      <div className="grid md:grid-cols-3 gap-5">
        {users.map((user) => (
          <div
            key={user._id?.toString()}
            className="shadow-md border rounded-xl hover:shadow-lg transition"
          >
            <div className="p-4 border-b">
              <h1 className="text-lg font-medium">{user.name}</h1>
            </div>
            <div className="p-4 space-y-2">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    user.isActive ? "text-green-600" : "text-red-500"
                  }
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </p>
              <p>
                <strong>Verified:</strong> {user.isVerified ? "Yes" : "No"}
              </p>

              {/* ---- Role Change Select ---- */}
              <div className="mt-3 space-y-2">
                <select
                  value={selectedRole}
                  onChange={(e) =>
                    setSelectedRole(e.target.value as UserRole)
                  }
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="rider">Rider</option>
                  <option value="super_admin">Super Admin</option>
                </select>

                <PrimaryButton
                  onClick={() => handleRoleChange(user?._id)}
                  className="mt-2 w-full"
                  disabled={changingRoleId === user._id?.toString()}
                >
                  {changingRoleId === user._id?.toString()
                    ? "Changing..."
                    : "Change Role"}
                </PrimaryButton>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- Pagination ---------- */}
      {pagination?.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <PrimaryButton
            disabled={pagination?.currentPage <= 1}
            onClick={() => console.log("Prev page")}
          >
            Prev
          </PrimaryButton>
          <span>
            Page {pagination?.currentPage} of {pagination?.totalPages}
          </span>
          <PrimaryButton
            disabled={pagination?.currentPage >= pagination?.totalPages}
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
