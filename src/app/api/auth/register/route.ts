import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserCollection, getTenantCollection } from "@/lib/database/db_collections";
import { MongoServerError } from "mongodb";
import { UserRole } from "@/Interfaces/userInterfaces";

interface RequestBody {
  name: string;
  email: string;
  password: string;
  role?: UserRole;   // Optional, default = "user"
}

export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    const usersCollection = await getUserCollection();
    const tenantsCollection = await getTenantCollection();
    const body: RequestBody = await req.json();
    const { name, email, password, role } = body;

    // 🧩 Basic Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // 🧩 Check existing user
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 409 }
      );
    }

    // 🧩 Determine tenantId from subdomain
    const host = req.headers.get("host") || "";
    const hostname = host.split(":")[0]; // remove port if exists
    const subdomain = hostname.includes(".") ? hostname.split(".")[0] : "";
    console.log('subbbbbbbbb', subdomain, hostname, host);

    let tenantId: string | null = null;

    // Only assign tenantId for non-super-admin users
    if (role !== "super_admin") {
      if (!subdomain || subdomain === "www" || subdomain === "lvh" || subdomain === "localhost") {
        return NextResponse.json(
          { success: false, message: "Invalid tenant subdomain" },
          { status: 400 }
        );
      }

      // 🔹 Find tenant by slug OR domain
      const tenant = await tenantsCollection.findOne({
        status: "active",
        $or: [
          { slug: subdomain },
          { domain: { $regex: new RegExp(subdomain, "i") } }, // case-insensitive match
        ],
      });

      if (!tenant) {
        return NextResponse.json(
          { success: false, message: "Tenant not found or inactive" },
          { status: 404 }
        );
      }

      tenantId = tenant.tenantId;
    }

    // 🧩 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🧩 Insert new user
    const result = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      tenantId: tenantId,
      isActive: true,
      isVerified: true, // email verification optional
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!result.acknowledged) {
      return NextResponse.json(
        { success: false, message: "Failed to register user" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Registration error:", error);
    if (error instanceof MongoServerError && error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};
