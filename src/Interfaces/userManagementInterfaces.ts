import { TenantStatus } from "./tenantInterface";
import { User } from "./userInterfaces";

export interface TenantCardOverview {
  tenantId: string;
  tenantName: string;
  tenantStatus: TenantStatus;
  totalUsers: number;
}



export interface TenantInfo {
  tenantId: string;
  tenantName: string;
  tenantStatus: string;
}

export interface TenantUsersResponse {
  tenantInfo: TenantInfo;
  adminInfo: User | null;
  users: User[];
  tenantUserCount: number;
  pagination: {
    totalUsers: number;
    currentPage: number;
    totalPages: number;
  };
}
