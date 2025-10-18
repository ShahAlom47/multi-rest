/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserCollection, getTenantCollection } from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const { tenantId } = params;
    const url = new URL(req.url);

    if (!tenantId) {
      return NextResponse.json(
        { success: false, message: "Tenant ID is required" },
        { status: 400 }
      );
    }

    const usersCollection = await getUserCollection();
    const tenantCollection = await getTenantCollection();

    // 🔹 Pagination setup
    const currentPage = parseInt(url.searchParams.get("currentPage") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const skip = (currentPage - 1) * pageSize;

    // 🔹 Filters
    const search = url.searchParams.get("search")?.trim() || "";
    const sort = url.searchParams.get("sort") || "createdAt-desc";
    const status = url.searchParams.get("status");
    const role = url.searchParams.get("role");

    // ✅ Tenant-based filter
    const filter: any = { tenantId };

    if (search) {
      filter.$and = [
        { tenantId },
        {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
          ],
        },
      ];
    }

    if (status) filter.isActive = status === "active";
    if (role) filter.role = role;

    // 🔽 Sort
    const sortQuery: any = {};
    if (sort.includes("-")) {
      const [field, order] = sort.split("-");
      sortQuery[field] = order === "desc" ? -1 : 1;
    } else {
      sortQuery["createdAt"] = -1;
    }

    // 🔹 Exclude sensitive fields
    const projection = {
      password: 0,
      emailVerificationToken: 0,
      "deviceInfo.fcmToken": 0,
    };

    // 🔹 Fetch tenant info
    const tenantInfo = await tenantCollection.findOne(
      { tenantId },
      { projection: { _id: 0, tenantId: 1, name: 1, status: 1 } }
    );

    // 🔹 Fetch users
    const [users, total] = await Promise.all([
      usersCollection
        .find(filter, { projection })
        .sort(sortQuery)
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      usersCollection.countDocuments({ tenantId }),
    ]);

    // 🔹 Separate admin info
    const adminInfo = users.find((user) => user.role === "admin") || null;
    const filteredUsers = users.filter((user) => user.role !== "admin");

    return NextResponse.json(
      {
        success: true,
        message: "Tenant users fetched successfully",
        data: {
          tenantInfo: {
            tenantId: tenantInfo?.tenantId || tenantId,
            tenantName: tenantInfo?.name || "Unknown Tenant",
            tenantStatus: tenantInfo?.status || "unknown",
          },
          adminInfo,
          users: filteredUsers,
          tenantUserCount: total,
        },
        pagination: {
          totalUsers: total,
          currentPage,
          totalPages: Math.ceil(total / pageSize),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching tenant users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
