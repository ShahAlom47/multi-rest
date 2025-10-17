/* eslint-disable @typescript-eslint/no-explicit-any */

import { getTenantCollection, getUserCollection } from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const tenantCollection = await getTenantCollection();
    const usersCollection = await getUserCollection();

    // Pagination setup
    const currentPage = parseInt(url.searchParams.get("currentPage") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const skip = (currentPage - 1) * pageSize;

    // Filters & search
    const search = url.searchParams.get("search")?.trim() || "";
    const sort = url.searchParams.get("sort") || "createdAt-desc";
    const status = url.searchParams.get("status");

    if (isNaN(currentPage) || isNaN(pageSize)) {
      return NextResponse.json(
        { message: "Invalid pagination params", success: false },
        { status: 400 }
      );
    }

    const filter: any = {};

    // 🔍 Search by name, domain, or email
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { domain: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // 🔎 Filter by status
    if (status) {
      filter.status = status;
    }

    // 🔽 Sort handling (example: createdAt-desc)
    const sortQuery: any = {};
    if (sort.includes("-")) {
      const [field, order] = sort.split("-");
      sortQuery[field] = order === "desc" ? -1 : 1;
    } else {
      sortQuery["createdAt"] = -1;
    }

    // 🔹 Fetch Tenants & total count in parallel
    const [tenants, total] = await Promise.all([
      tenantCollection.find(filter).sort(sortQuery).skip(skip).limit(pageSize).toArray(),
      tenantCollection.countDocuments(filter),
    ]);

    // 🔹 Add totalUsers for each tenant
    const tenantsWithUserCount = await Promise.all(
      tenants.map(async (tenant) => {
        const totalUsers = await usersCollection.countDocuments({ tenantId: tenant.tenantId });
        return {
          ...tenant,
          totalUsers,
        };
      })
    );

    return NextResponse.json({
      success: true,
      message: "Tenants retrieved successfully",
      data: tenantsWithUserCount,
      totalData: total,
      currentPage,
      totalPages: Math.ceil(total / pageSize),
    }, { status: 200 });

  } catch (error) {
    console.error("GET /api/tenant/all Error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to retrieve tenants",
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
