// src/app/api/tenants/route.ts
import { getTenantCollection } from "@/lib/database/db_collections";
import { generateTenantId } from "@/utils/generateTenantId";
import { NextResponse } from "next/server";

export interface TenantFormData {
  name: string;
  slug: string;
  email: string;
  phone?: string;
  domain: string;
  logoUrl?: string;
  status?: "active" | "pending" | "suspended";
}

export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    const tenantCollection = await getTenantCollection();
    const body: TenantFormData = await req.json();
    const { name, email, slug, phone, domain, logoUrl, status } = body;

    // 🧩 Basic Validation
    if (!name || !email || !slug || !domain) {
      return NextResponse.json(
        { success: false, message: "Name, email, slug, and domain are required" },
        { status: 400 }
      );
    }

    // 🧩 Generate unique tenantId
    const tenantId = generateTenantId();

    // 🧩 Check existing tenant by slug or domain
    const existingTenant = await tenantCollection.findOne({
      $or: [{ slug }, { domain }, { email }],
    });
    if (existingTenant) {
      return NextResponse.json(
        { success: false, message: "Tenant already exists with same slug, domain or email" },
        { status: 409 }
      );
    }

    // 🧩 Insert new tenant
    const result = await tenantCollection.insertOne({
      tenantId,
      name,
      slug,
      email,
      phone: phone || "",
      domain,
      logoUrl: logoUrl || "",
      status: status || "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!result.acknowledged) {
      return NextResponse.json(
        { success: false, message: "Failed to add tenant" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Tenant added successfully", tenantId },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Add Tenant Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};
