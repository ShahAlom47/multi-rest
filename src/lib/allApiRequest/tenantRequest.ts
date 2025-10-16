import {  TenantFormData, TenantStatus } from "@/Interfaces/tenantInterface";
import { request } from "./apiRequests";

 
type GetAllTenantsParams = {
  currentPage: number;
  limit: number;
  search?: string;
  sort?: string; // example: "createdAt-desc" or "name-asc"
  status?: TenantStatus;
  isDashboardRequest?: boolean;
};

export const getAllTenants = async (params: GetAllTenantsParams) => {
  const {
    currentPage,
    limit,
    search,
    sort,
    status,
    isDashboardRequest,
  } = params;

  const queryParams = new URLSearchParams();

  queryParams.set("currentPage", String(currentPage));
  queryParams.set("pageSize", String(limit));

  if (search) queryParams.set("search", search);
  if (sort) queryParams.set("sort", sort);
  if (status) queryParams.set("status", status);

  const url = `/tenant/all?${queryParams.toString()}`;

  const customHeaders: Record<string, string> | undefined = isDashboardRequest
    ? { "x-from-dashboard": "true" }
    : undefined;

  return request("GET", url, undefined, undefined, customHeaders);
};


export const createTenant = async (data: TenantFormData) => {
  return request("POST", "/tenant/add", { ...data });
}
export const getTenantById = async (id: string) => {
  return request("GET", `/tenant/singleTenant/${id}`);
}
export const updateTenantById = async (tenantId: string, data: TenantFormData) => {
  return request("PATCH", `/tenant/update/${tenantId}`, { ...data });
}
