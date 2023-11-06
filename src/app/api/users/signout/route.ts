import { NextResponse } from "next/server";

export async function POST(res: NextResponse) {
  await res.cookies.delete("token");
  return NextResponse.json(
    { message: "Successfully signed out" },
    { status: 200 },
  );
}
