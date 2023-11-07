import { NextRequest, NextResponse } from "next/server";
import Message from "@/app/models/Message";

export async function DELETE(req: NextRequest) {
  try {
    const userData = await req.json();

    await Message.deleteOne({
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
      { status: 400 },
    );
  }
}
