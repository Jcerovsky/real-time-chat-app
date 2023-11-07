import { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader(
    "Set-Cookie",
    "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
  );
  return res.status(200).json({ message: "Successfully signed out" });
}
