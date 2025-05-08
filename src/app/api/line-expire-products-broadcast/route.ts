import { NextResponse } from "next/server";
import { getExpireProductsListBroadcast } from "@/services/line-bot-services";

// Ensure the route is always dynamically rendered and not cached
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    /* Broadcast expired product notifications to all users in the group */
    await getExpireProductsListBroadcast();
    return new NextResponse(null, { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(null, { status: 500 });
  }
}

// Handle other HTTP methods
export async function GET() {
  return new NextResponse(null, { status: 405 });
}

export async function PUT() {
  return new NextResponse(null, { status: 405 });
}

export async function DELETE() {
  return new NextResponse(null, { status: 405 });
}

export async function PATCH() {
  return new NextResponse(null, { status: 405 });
}
