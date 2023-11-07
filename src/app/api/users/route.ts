import connectDb from "@/app/lib/mongoose";
import bcrypt from "bcryptjs";
import { FormProps } from "@/app/signup/page";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/app/models/User";

async function handler(req: NextRequest) {
  await connectDb();
  const incomingUrl = req.headers.get("X-Custom-Referer");

  if (req.method === "GET") {
    try {
      const data = await User.find();
      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json(
        { error: "An error occurred while getting messages" },
        { status: 500 },
      );
    }
  } else if (req.method === "POST") {
    const userData: FormProps = await req.json();
    try {
      if (incomingUrl === "/login") {
        const existingUser = await User.findOne({
          username: userData.username.trim(),
        });
        if (existingUser !== null) {
          const match = await bcrypt.compare(
            userData.password.trim(),
            existingUser.password,
          );
          if (match) {
            const token = jwt.sign(
              { username: existingUser.username },
              process.env.JWT_SECRET!,
              { expiresIn: "1h" },
            );
            return new Response("Successfully logged in", {
              status: 200,
              headers: {
                "Set-Cookie": `token=${token}; HttpOnly; ${
                  process.env.NODE_ENV !== "development" ? "Secure" : ""
                }SameSite=Strict `,
                "Content-Type": "text/plain",
              },
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
      const user = new User({
        username: userData.username,
        password: hashedPassword,
      });
      await user.save();

      return NextResponse.json(
        { message: "Created user successfully" },
        { status: 201 },
      );
    } catch (error: any) {
      console.error(error);
      const status = error.code === 11000 ? 409 : 500;
      const errorMessage =
        error.code === 11000
          ? "User with this name already exists"
          : "An error occurred while creating the user";
      return NextResponse.json({ error: errorMessage }, { status });
    }
  }
}

export { handler as GET, handler as POST };
