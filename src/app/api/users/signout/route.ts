import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  await res.cookies.delete("token");
  return NextResponse.json(
    { message: "Successfully signed out" },
    { status: 200 },
  );
}
