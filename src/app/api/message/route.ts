import { connectDb } from "@/app/lib/mongodb";

await async function handler(req, res) {
  const client = await connectDb();
  if (req.method === "POST") {
  }
};

export { handler as GET, handler as POST };
