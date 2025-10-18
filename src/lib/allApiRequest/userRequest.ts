
import { request } from "./apiRequests";



export const getAllTenantUsers = async (tenantId: string | '') => {
  return request("GET", `/super-admin/users/tenantUsers/${tenantId}`);
}