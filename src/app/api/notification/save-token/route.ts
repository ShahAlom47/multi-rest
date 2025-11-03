import { getNotificationCollection } from "@/lib/database/db_collections";
import { NextResponse } from "next/server";

export interface NotificationTokenData {
  token: string;
  restaurant_id?: string; // optional - যদি token কে নির্দিষ্ট restaurant এর সাথে map করতে চাও
}

export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    const notificationCollection = await getNotificationCollection();
    const body: NotificationTokenData = await req.json();
    const { token, restaurant_id } = body;

    // 🧩 Basic Validation
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token is required" },
        { status: 400 }
      );
    }

    // 🧩 Check if token already exists
    const existingToken = await notificationCollection.findOne({ token } as any);
    if (existingToken) {
      return NextResponse.json(
        { success: true, message: "Token already exists", token },
        { status: 200 }
      );
    }

    // 🧩 Save new token
    const result = await notificationCollection.insertOne({
      token,
      tenantId: restaurant_id || null,
      createdAt: new Date(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    if (!result.acknowledged) {
      return NextResponse.json(
        { success: false, message: "Failed to save notification token" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Notification token saved successfully",
        tokenId: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Save Notification Token Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};
