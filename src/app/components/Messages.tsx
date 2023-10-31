import React, { useEffect, useRef, useState } from "react";
import {
  HomepageProps,
  MessageProps,
  UserProps,
} from "@/app/interfaces/interfaces";
import MessageActions from "@/app/components/MessageActions";

interface I {
  messages: MessageProps[];
  currentUserId: UserProps | undefined;
  state: HomepageProps;
  setMessages: React.Dispatch<React.SetStateAction<MessageProps[]>>;
}

function Messages({ messages, currentUserId, state, setMessages }: I) {
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const [areMenuActionsShown, setAreMenuActionsShown] =
    useState<boolean>(false);
  const [selectedMsgId, setSelectedMsgId] = useState<string>("");

  const lastMessageRef = useRef<HTMLDivElement>(null);
  const filteredMessages = messages.filter(
    (msg) =>
      (msg.to === state.selectedUser?.username &&
        msg.sender === currentUserId?.username) ||
      (msg.sender === state.selectedUser?.username &&
        msg.to === currentUserId?.username),
  );

  const handleSelectMessage = async (msg: MessageProps) => {
    setSelectedMsgId(msg._id!);
    setAreMenuActionsShown((prevState) => !prevState);
  };

  const handleDelete = async () => {
    const API_URL = process.env.API_URL || "http://localhost:3000";
    const res = await fetch(`${API_URL}/api/messages`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedMsgId),
    });

    if (res.status === 204) {
      console.log("deleted");
      const updatedMessages = messages.filter(
        (msg) => msg._id !== currentUserId,
      );
      setMessages(updatedMessages);
    }
  };

  return (
    <div className="mt-5 p-4 text-xs sm:text-sm">
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
            className={`rounded-lg py-1 px-2 cursor-pointer ${
              message.sender === currentUserId?.username
                ? "bg-blue-400"
                : "bg-gray-300"
            }`}
            onClick={() => handleSelectMessage(message)}
          >
            {message.content}
          </p>
          {i === filteredMessages.length - 1 && <div ref={lastMessageRef} />}
          {selectedMsgId === message._id && (
            <MessageActions
              isVisible={areMenuActionsShown}
              handleDelete={handleDelete}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default Messages;
