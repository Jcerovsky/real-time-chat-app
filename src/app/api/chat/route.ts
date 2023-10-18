import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/app/lib/mongodb";
import { FormProps } from "@/app/signup/page";

async function handler(req: NextRequest, res: NextApiResponse) {
  const client = await connectDb();

  if (!client) {
    return res.status(500).json({ error: "Could not connect to database" });
  }

  const db = client.db("chatApp");
  const usersCollection = db.collection("Users");
  const userData: FormProps = await req.json();

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
  } else if (req.method === "POST") {
    try {
      await usersCollection.insertOne({
        name: userData.username,
        password: userData.password,
      });
      res.status(201).json({ message: "Created user successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while creating a user:" + error });
    }
  }
}

export { handler as GET, handler as POST };
