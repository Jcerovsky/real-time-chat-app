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
}

function Messages({ messages, currentUserId, state }: I) {
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const [areMenuActionsShown, setAreMenuActionsShown] =
    useState<boolean>(false);
  const [selectedMsgIndex, setSelectedMsgIndex] = useState<number | null>(null);

  const lastMessageRef = useRef<HTMLDivElement>(null);
  const filteredMessages = messages.filter(
    (msg) =>
      (msg.to === state.selectedUser?.username &&
        msg.sender === currentUserId?.username) ||
      (msg.sender === state.selectedUser?.username &&
        msg.to === currentUserId?.username),
  );

  const handleSelectMessage = async (msg: MessageProps, i: number) => {
    console.log("msgid", msg._id);
    setAreMenuActionsShown((prevState) => !prevState);
  };

  console.log("messages", messages);

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
            onClick={() => handleSelectMessage(message, i)}
          >
            {message.content}
          </p>
          {i === filteredMessages.length - 1 && <div ref={lastMessageRef} />}
          {selectedMsgIndex === i && (
            <MessageActions isVisible={areMenuActionsShown} />
          )}
        </div>
      ))}
    </div>
  );
}

export default Messages;
