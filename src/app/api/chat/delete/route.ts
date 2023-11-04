import connectDb from "@/app/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import Message from "@/app/models/Message";

export async function DELETE(req: NextRequest) {
  try {
    await connectDb();
  } catch (error) {
    return NextResponse.json(
      { error: "Could not connect to database" },
      { status: 500 },
    );
  }
  try {
    const userData = await req.json();

    await Message.deleteMany({
      $or: [
        {
          sender: userData.currentUser,
          to: userData.selectedUser.username,
        },
        {
          sender: userData.selectedUser.username,
          to: userData.currentUser,
        },
      ],
    });
    return NextResponse.json({ message: "Chat deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Could not delete chat:", error },
      { status: 500 },
    );
  }
}
