import { connectDb } from "@/app/lib/mongodb";
import { FormProps } from "@/app/signup/page";
import { NextRequest, NextResponse } from "next/server";

async function handler(req: NextRequest) {
  return NextResponse.json({ message: "all good" }, { status: 200 });
  // const client = await connectDb();
  //
  // if (!client) {
  //   return res.status(500).json({ error: "Could not connect to database" });
  // }
  //
  // const db = client.db("chatApp");
  // const usersCollection = db.collection("Users");
  // const userData: FormProps = req.body;
  //
  // if (req.method === "GET") {
  //   try {
  //     const data = await usersCollection.find({ name: "test" }).toArray();
  //     console.log("success");
  //     return res.json(data);
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .json({ error: `An error occurred while getting messages : ${error}` });
  //   }
  // } else if (req.method === "POST") {
  //   try {
  //     await usersCollection.insertOne({
  //       name: userData.username,
  //       password: userData.password,
  //     });
  //     res.status(201).json({ message: "Created user successfully" });
  //   } catch (error: any) {
  //     if (error.code === 11000) {
  //       return res
  //         .status(409)
  //         .json({ error: "User with this name already exists" });
  //     }
  //     res
  //       .status(500)
  //       .json({ error: "An error occurred while creating a user:" + error });
  //   }
  // }
}

export { handler as GET, handler as POST };
