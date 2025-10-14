import {  TenantFormData } from "@/Interfaces/tenantInterface";
import { request } from "./apiRequests";

export const createTenant = async (data: TenantFormData) => {
  return request("POST", "/tenant/add", { ...data });
}
