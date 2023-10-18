import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/app/lib/mongodb";

async function handler(req: NextRequest, res: NextApiResponse) {
  const client = await connectDb();

  if (!client) {
    return res.status(500).json({ error: "Could not connect to database" });
  }

  const db = client.db("chatApp");
  const usersCollection = db.collection("Users");

  if (req.method === "GET") {
    try {
      const data = await usersCollection.find({ name: "Jakub" }).toArray();
      console.log("success");
      return NextResponse.json(data);
    } catch (error) {
      res
        .status(500)
        .json({ error: `An error occurred while getting messages : ${error}` });
    }
  }
}

export { handler as GET, handler as POST };
