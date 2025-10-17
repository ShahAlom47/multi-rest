// src/app/api/tenant/[tenantId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getTenantCollection } from "@/lib/database/db_collections";

export async function GET(req: NextRequest, { params }: { params: { tenantId: string } }) {
  try {
    const { tenantId } = params;
    
    console.log(tenantId)

    const tenantCollection = await getTenantCollection();

    const tenant = await tenantCollection.findOne({ tenantId: tenantId });

    if (!tenant) {
      return NextResponse.json(
        { success: false, message: "Tenant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tenant retrieved successfully",
      data: tenant,
    });
  } catch (error) {
    console.error("Get Tenant Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get tenant", error: (error as Error).message },
      { status: 500 }
    );
  }
}
