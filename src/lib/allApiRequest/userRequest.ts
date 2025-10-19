
import { ObjectId } from "mongodb";
import { request } from "./apiRequests";



export const getAllTenantUsers = async (
  tenantId: string | '',
  { search = '', sort = '', page = 1, limit = 10 } = {}
) => {
  const queryParams = new URLSearchParams({
    ...(search && { search }),
    ...(sort && { sort }),
    page: page.toString(),
    limit: limit.toString(),
  });

  return request("GET", `/super-admin/users/tenantUsers/${tenantId}?${queryParams}`);
};

export const changeUserRole = async (
  userId: string | ObjectId | undefined,
  newRole: string | undefined       
) => {
  return request("PATCH", `/super-admin/users/changeRole/${userId}`, {
    role: newRole,
  });
}
