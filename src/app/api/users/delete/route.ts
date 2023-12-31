import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/User";

export async function POST(req: NextRequest) {
  const username = await req.json();

  try {
    await User.deleteOne({ username: username });
    return NextResponse.json(
      { message: "User successfully deleted" },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: "There was an error deleting user:", err },
      { status: 500 },
    );
  }
}
