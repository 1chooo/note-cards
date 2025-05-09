import { NextResponse } from "next/server";

import { getExpireProductsListBroadcast } from "@/services/line-bot-services";

// Ensure the route is always dynamically rendered and not cached
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    /* Broadcast expired product notifications to all users in the group */
    await getExpireProductsListBroadcast();
    return NextResponse.json(
      { message: "Broadcast successful" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
