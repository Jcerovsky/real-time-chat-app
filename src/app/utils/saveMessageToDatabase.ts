import { MessageProps } from "@/app/interfaces/interfaces";

export const saveMessageToDatabase = async (messageData: MessageProps) => {
  const res = await fetch(`/api/messages`, {
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
