/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserCollection } from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export type UserRole = "user" | "admin" | "rider" | "super_admin";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const body = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const { role } = body;

    // Validate role
    const validRoles: UserRole[] = ["user", "admin", "rider", "super_admin"];
    if (!role || !validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, message: "Invalid role provided" },
        { status: 400 }
      );
    }

    const userCollection = await getUserCollection();

    // Check if user exists
    const existingUser = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Update role
    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role } }
    );

    return NextResponse.json(
      { success: true, message: `User role updated to '${role}' successfully` },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PATCH /api/user/update/[userId] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update user",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
