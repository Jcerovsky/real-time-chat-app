import { connectDb } from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";
import { FormProps } from "@/app/signup/page";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

async function handler(req: NextRequest) {
  const client = await connectDb();
  const incomingUrl = req.headers.get("X-Custom-Referer");

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
      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json(
        { error: "An error occurred while getting messages" },
        { status: 500 },
      );
    }
  } else if (req.method === "POST") {
    try {
      if (incomingUrl === "/login") {
        const existingUser = await usersCollection.findOne({
          username: userData.username,
        });
        if (existingUser !== null) {
          const match = await bcrypt.compare(
            userData.password,
            existingUser.password,
          );
          if (match) {
            const token = jwt.sign(
              { username: existingUser.username },
              process.env.JWT_SECRET!,
              { expiresIn: "1h" },
            );
            return NextResponse.json({
              message: "Successfully logged in",
              token,
            });
          } else {
            return NextResponse.json(
              { error: "Invalid password" },
              { status: 401 },
            );
          }
        } else {
          return NextResponse.json(
            { error: "User does not exist" },
            { status: 404 },
          );
        }
      }
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await usersCollection.insertOne({
        username: userData.username,
        password: hashedPassword,
      });
      return NextResponse.json(
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
