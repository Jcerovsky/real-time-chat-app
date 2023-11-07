import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    await res.cookies.delete("token");
    return NextResponse.json(
      { message: "Successfully signed out" },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Could not sign out:", err },
      { status: 500 },
    );
  }
}
