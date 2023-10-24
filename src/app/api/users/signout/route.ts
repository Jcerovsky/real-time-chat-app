import { NextResponse } from "next/server";

export async function POST(res: NextResponse) {
  return res.cookies.delete("token");
}
