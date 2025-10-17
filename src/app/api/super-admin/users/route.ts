import { NextResponse } from "next/server";
import { getUserCollection, getTenantCollection } from "@/lib/database/db_collections";
import { ISuperAdminTenantOverview, TenantAdmin } from "@/Interfaces/userManagement";
import { User } from "@/Interfaces/userInterfaces";
import { TenantData } from "@/Interfaces/tenantInterface";

export const GET = async (): Promise<NextResponse> => {
  try {
    const usersCollection = await getUserCollection();
    const tenantsCollection = await getTenantCollection();

    // Step 1: সব tenants আনবে
    const tenants: TenantData[] = await tenantsCollection
      .find({}, { projection: { tenantId: 1, name: 1, status: 1, createdAt: 1, updatedAt: 1 } })
      .toArray();

    const responseData: ISuperAdminTenantOverview[] = [];

    // Step 2: প্রতিটি tenant এর user data collect করবে
    for (const tenant of tenants) {
      const allUsers: User[] = await usersCollection
        .find<User>({ tenantId: tenant.tenantId })
        .project<User>({
          _id: 1,
          name: 1,
          email: 1,
          role: 1,
          phone: 1,
          isActive: 1,
          isVerified: 1,
          createdAt: 1,
          lastLogin: 1,
        })
        .toArray();

      // Step 3: Admin খুঁজে বের করা
      const adminUser = allUsers.find((u) => u.role === "admin") as TenantAdmin;

      const tenantOverview: ISuperAdminTenantOverview = {
        tenantId: tenant.tenantId,
        tenantName: tenant.name,
        tenantStatus: tenant.status === "active" ? "active" : "suspended", // pending থাকলে suspended হিসাবে ধরবে UI তে
        totalUsers: allUsers.length,
        admin: adminUser || {
          name: "No Admin Found",
          email: "-",
          role: "admin",
          isVerified: false,
          isActive: false,
          permissions: [],
        },
        users: allUsers.filter((u) => u.role !== "admin"),
        createdAt: tenant.createdAt ? String(tenant.createdAt) : undefined,
        lastActiveAt: tenant.updatedAt ? String(tenant.updatedAt) : undefined,
      };

      responseData.push(tenantOverview);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Tenant users overview fetched successfully",
        data: responseData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching tenant user overview:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};
