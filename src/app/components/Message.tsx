import React, { useEffect, useRef } from "react";
import {
  HomepageProps,
  MessageProps,
  UserProps,
} from "@/app/interfaces/interfaces";

interface I {
  messages: MessageProps[];
  currentUserId: UserProps | undefined;
  state: HomepageProps;
}

function Message({ messages, currentUserId, state }: I) {
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const lastMessageRef = useRef<HTMLDivElement>(null);
  const filteredMessages = messages.filter(
    (msg) =>
      (msg.to === state.selectedUser?.username &&
        msg.sender === currentUserId?.username) ||
      (msg.sender === state.selectedUser?.username &&
        msg.to === currentUserId?.username),
  );

  return (
    <>
      {filteredMessages.map((message, i) => (
        <div
          key={i}
          className={`flex mb-2 font-medium relative ${
            message.sender === currentUserId?.username
              ? "justify-end"
              : "justify-start"
          }`}
        >
          <p
            className={`rounded-md py-1 px-2 ${
              message.sender === currentUserId?.username
                ? "bg-blue-400"
                : "bg-gray-300"
            }`}
          >
            {message.content}
          </p>
          {i === filteredMessages.length - 1 && <div ref={lastMessageRef} />}
        </div>
      ))}
    </>
  );
}

export default Message;
