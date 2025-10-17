import { TenantStatus } from "./tenantInterface";

export interface TenantCardOverview {
  tenantId: string;
  tenantName: string;
  tenantStatus: TenantStatus;
  totalUsers: number;
}