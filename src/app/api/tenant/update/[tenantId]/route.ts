/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTenantCollection } from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { tenantId: string } }
) {

  console.log(params)
  try {
    const { tenantId } = params;
    const body = await req.json();

    if (!tenantId) {
      return NextResponse.json(
        { success: false, message: "Tenant ID is required" },
        { status: 400 }
      );
    }

    const tenantCollection = await getTenantCollection();

    // Validation
    const existingTenant = await tenantCollection.findOne({ tenantId });
    if (!existingTenant) {
      return NextResponse.json(
        { success: false, message: "Tenant not found" },
        { status: 404 }
      );
    }

    // Update fields dynamically
    const updateData: any = {};
    if (body.name) updateData.name = body.name;
    if (body.slug) updateData.slug = body.slug;
    if (body.email) updateData.email = body.email;
    if (body.phone) updateData.phone = body.phone;
    if (body.domain) updateData.domain = body.domain;
    if (body.status) updateData.status = body.status;
    if (body.themeColor) updateData.themeColor = body.themeColor;
    if (body.logoUrl) updateData.logoUrl = body.logoUrl;
    if (body.status) updateData.status = body.status;

    // Add timestamp
    updateData.updatedAt = new Date().toISOString();

    const result = await tenantCollection.updateOne(
      { tenantId },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "No changes were made" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Tenant updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PATCH /api/tenant/update/[tenantId] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update tenant",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
