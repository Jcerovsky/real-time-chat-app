import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/app/lib/mongoose";
import User from "@/app/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
  } catch (err) {
    return NextResponse.json(
      { error: "Could not connect to database:" },
      { status: 500 },
    );
  }

  const userData = await req.json();

  try {
    await User.deleteOne({ username: userData.username });
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
