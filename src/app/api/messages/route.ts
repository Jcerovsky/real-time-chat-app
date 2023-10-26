import connectDb from "@/app/lib/mongoose";
import Message from "@/app/models/Message";
import { NextRequest, NextResponse } from "next/server";
import { NextApiResponse } from "next";

interface IMessage {
  sender: string;
  content: string;
  to: string;
}

const handler = async (req: NextRequest, res: NextApiResponse) => {
  try {
    await connectDb();
  } catch (err) {
    return NextResponse.json(
      { error: "Could not connect to database" },
      { status: 500 },
    );
  }

  if (req.method === "POST") {
    try {
      const data: IMessage = await req.json();

      const newMessage = new Message({
        fromUserID: data.sender,
        toUserID: data.to,
        content: data.content,
      });
      await newMessage.save();
      return NextResponse.json(data);
    } catch (err) {
      return NextResponse.json(
        { error: "Could not save message to database:", err },
        { status: 500 },
      );
    }
  }
};

export { handler as POST };
