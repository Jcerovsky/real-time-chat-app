import { MessageProps } from "@/app/interfaces/interfaces";

export const saveMessageToDatabase = async (messageData: MessageProps) => {
  const API_URL = process.env.API_URL || "http://localhost:3000";
  const res = await fetch(`${API_URL}/api/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messageData),
  });
  if (res.ok) {
    return await res.json();
  } else {
    throw new Error("Could not save to database");
  }
};
