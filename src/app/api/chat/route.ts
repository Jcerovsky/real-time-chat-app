import { connectDb } from "@/app/lib/mongodb";
import { FormProps } from "@/app/signup/page";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";

async function handler(req: NextRequest) {
  const client = await connectDb();

  if (!client) {
    return NextResponse.json(
      { error: "Could not connect to database" },
      { status: 500 },
    );
  }

  const db = client.db("chatApp");
  const usersCollection = db.collection("Users");
  const userData: FormProps = await req.json();

  if (req.method === "GET") {
    try {
      const data = await usersCollection.find({ name: "test" }).toArray();
      console.log("success");
      return NextResponse.json(data);
    } catch (error) {
      NextResponse.json(
        { error: "An error occurred while getting messages" },
        { status: 500 },
      );
    }
  } else if (req.method === "POST") {
    try {
      await usersCollection.insertOne({
        name: userData.username,
        password: userData.password,
      });
      NextResponse.json(
        { message: "Created user successfully" },
        { status: 201 },
      );
    } catch (error: any) {
      if (error.code === 11000) {
        return NextResponse.json(
          { error: "User with this name already exists" },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { error: "An error occurred while creating the user" },
        { status: 500 },
      );
    }
  }
}

export { handler as GET, handler as POST };
