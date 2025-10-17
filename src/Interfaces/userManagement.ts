// userManagement.ts

import { User } from "./userInterfaces";



// Admin info inside a tenant
export interface TenantAdmin extends User {
  permissions?: string[];
}

// Tenant info for dashboard
export interface ISuperAdminTenantOverview {
  tenantId: string;
  tenantName: string;
  tenantStatus: "active" | "suspended";
  totalUsers: number;
  admin: TenantAdmin ;
  users: User[];
  createdAt?: string;
  lastActiveAt?: string;
}


