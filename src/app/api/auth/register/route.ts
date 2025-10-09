import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserCollection } from "@/lib/database/db_collections";
import { MongoServerError } from "mongodb";
import { UserRole } from "@/Interfaces/userInterfaces";

interface RequestBody {
  name: string;
  email: string;
  password: string;
  role?: UserRole;   // Optional, default = "user"
  tenantId?: string; // Optional (required if not super_admin)
}

export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    const usersCollection = await getUserCollection();
    const body: RequestBody = await req.json();
    const { name, email, password, role = "user", tenantId } = body;

    // 🧩 Basic Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // 🧩 Tenant rule: super_admin বাদে সবার জন্য tenantId লাগবে
    if (role !== "super_admin" && !tenantId) {
      return NextResponse.json(
        { success: false, message: "Tenant ID is required for this role" },
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

    // 🧩 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🧩 Insert new user
    const result = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      role,
      tenantId: role === "super_admin" ? null : tenantId,
      isActive: true,
      isVerified: true, // এখন Email verification দরকার নেই
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
