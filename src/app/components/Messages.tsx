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

export interface EditedMessageProps extends MessageProps {
  isEdited: boolean;
}

function Messages({ messages, currentUserId, state, setMessages }: I) {
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const [menuState, setMenuState] = useState<{ id: string; visible: boolean }>({
    id: "",
    visible: false,
  });

  const [editedMsg, setEditedMsg] = useState<EditedMessageProps | null>(null);

  const lastMessageRef = useRef<HTMLDivElement>(null);
  const filteredMessages = messages.filter(
    (msg) =>
      (msg.to === state.selectedUser?.username &&
        msg.sender === currentUserId?.username) ||
      (msg.sender === state.selectedUser?.username &&
        msg.to === currentUserId?.username),
  );

  const handleSelectMessage = (msg: MessageProps) => {
    setMenuState((prevState) => ({
      id: msg._id!,
      visible: !prevState.visible,
    }));
  };

  const handleDelete = async () => {
    const API_URL = process.env.API_URL || "http://localhost:3000";
    const res = await fetch(`${API_URL}/api/messages`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(menuState.id),
    });

    if (res.status === 200) {
      const updatedMessages = messages.filter(
        (msg) => msg._id !== menuState.id,
      );
      setMessages(updatedMessages);
      setMenuState({ id: "", visible: false });
    }
  };

  const handleSendEditedMessage = async () => {
    const API_URL = process.env.API_URL || "http://localhost:3000";
    const res = await fetch(`${API_URL}/api/messages`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedMsg),
    });
    if (res.ok) {
      const editedMessage = messages.filter(
        (msg) => msg._id === editedMsg?._id,
      );
      editedMessage[0].content = editedMsg!.content;
      setMessages(editedMessage);
      console.log("successfully edited");
    }
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    msg: MessageProps,
  ) => {
    setEditedMsg((prevState) => {
      const editedMessage = filteredMessages.find(
        (message) => message._id === msg._id,
      );
      if (!editedMessage) return null;
      if (!prevState) return null;
      return {
        ...editedMessage,
        content: e.target.value,
      };
    });
  };
  console.log("edited msg", editedMsg);

  const handleCopyText = (msg: string) => {
    navigator.clipboard.writeText(msg);
    setMenuState({ id: "", visible: false });
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
            {editedMsg?.isEdited && editedMsg?._id === message._id ? (
              <form onSubmit={handleSendEditedMessage}>
                <input
                  type="text"
                  value={editedMsg?.content}
                  onChange={(e) => handleEditChange(e, message)}
                />
              </form>
            ) : (
              message.content
            )}
          </p>
          {i === filteredMessages.length - 1 && <div ref={lastMessageRef} />}
          {message.sender === currentUserId?.username &&
            menuState.id === message._id &&
            menuState.visible && (
              <MessageActions
                handleCopyText={() => handleCopyText(message.content)}
                handleDelete={handleDelete}
                setEditedMsg={() => setEditedMsg(message)}
              />
            )}
        </div>
      ))}
    </div>
  );
}

export default Messages;
