/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserCollection } from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const { tenantId } = params;
    const url = new URL(req.url);
    const usersCollection = await getUserCollection();

    // 🔹 Ensure tenantId is provided
    if (!tenantId) {
      return NextResponse.json(
        { success: false, message: "Tenant ID is required" },
        { status: 400 }
      );
    }

    // 🔹 Pagination setup
    const currentPage = parseInt(url.searchParams.get("currentPage") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const skip = (currentPage - 1) * pageSize;

    // 🔹 Filters
    const search = url.searchParams.get("search")?.trim() || "";
    const sort = url.searchParams.get("sort") || "createdAt-desc";
    const status = url.searchParams.get("status");
    const role = url.searchParams.get("role");

    // ✅ Tenant-based base filter
    const filter: any = { tenantId: tenantId };

    // 🔍 Search within this tenant only
    if (search) {
      filter.$and = [
        { tenantId: tenantId },
        {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
          ],
        },
      ];
    }

    // 🔎 Filter by active/suspended user
    if (status) {
      filter.isActive = status === "active";
    }

    // 🔎 Filter by role
    if (role) {
      filter.role = role;
    }

    // 🔽 Sort setup
    const sortQuery: any = {};
    if (sort.includes("-")) {
      const [field, order] = sort.split("-");
      sortQuery[field] = order === "desc" ? -1 : 1;
    } else {
      sortQuery["createdAt"] = -1;
    }

    // 🔹 Fetch users securely (exclude sensitive fields)
    const projection = {
      password: 0,
      emailVerificationToken: 0,
      "deviceInfo.fcmToken": 0,
    };

    const [users, total] = await Promise.all([
      usersCollection
        .find(filter, { projection })
        .sort(sortQuery)
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      usersCollection.countDocuments(filter),
    ]);

    // 🔹 Separate Admin info
    const adminInfo = users.find((user) => user.role === "admin") || null;
    const filteredUsers = users.filter((user) => user.role !== "admin");

    return NextResponse.json(
      {
        success: true,
        message: "Tenant users fetched successfully",
        data: {
          adminInfo,
          users: filteredUsers,
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
