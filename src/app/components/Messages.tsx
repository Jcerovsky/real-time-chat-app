import React, { useEffect, useRef, useState } from "react";
import {
  HomepageProps,
  MessageProps,
  UserProps,
} from "@/app/interfaces/interfaces";
import MessageActions from "@/app/components/MessageActions";

interface I {
  currentUserId: UserProps | undefined;
  filteredMessages: MessageProps[];
  messages: MessageProps[];
  searchedResultIndexes: number[];
  setMessages: React.Dispatch<React.SetStateAction<MessageProps[]>>;
  state: HomepageProps;
}

export interface EditedMessageProps extends MessageProps {
  isEdited: boolean;
}

function Messages({
  messages,
  currentUserId,
  setMessages,
  filteredMessages,
  state,
  searchedResultIndexes,
}: I) {
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
  const formRef = useRef<HTMLFormElement>(null);
  const messageActionsRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setEditedMsg(null);
      }
      if (
        messageActionsRef.current &&
        !messageActionsRef.current.contains(event.target as Node)
      ) {
        setMenuState({ id: "", visible: false });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const index = searchedResultIndexes[state.searchedIndex];
    if (index !== undefined && messageRefs.current[index]) {
      messageRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
    }
  }, [searchedResultIndexes, state.searchedIndex]);

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

  const handleSendEditedMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const API_URL = process.env.API_URL || "http://localhost:3000";
    const res = await fetch(`${API_URL}/api/messages`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedMsg),
    });
    if (res.status === 200) {
      const editedMessage = messages.find((msg) => msg._id === editedMsg?._id);
      setMessages((prevState) => {
        return prevState.map((msg) => {
          if (msg._id === editedMessage?._id) {
            return {
              ...msg,
              content: editedMsg!.content,
            };
          } else {
            return msg;
          }
        });
      });
      setEditedMsg(null);
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
        isEdited: editedMsg?.isEdited ?? true,
      };
    });
  };

  const handleCopyText = async (msg: string) => {
    await navigator.clipboard.writeText(msg);
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
          <div
            className={`rounded-lg py-1 px-2 cursor-pointer ${
              message.sender === currentUserId?.username
                ? "bg-blue-400"
                : "bg-gray-300"
            }`}
            onClick={() => handleSelectMessage(message)}
          >
            {editedMsg?.isEdited && editedMsg?._id === message._id ? (
              <form onSubmit={handleSendEditedMessage} ref={formRef}>
                <input
                  type="text"
                  value={editedMsg?.content}
                  className="rounded-md dark:text-neutral-800"
                  onChange={(e) => handleEditChange(e, message)}
                />
              </form>
            ) : (
              <p
                ref={(el) => {
                  if (messageRefs.current) {
                    messageRefs.current[i] = el;
                  }
                }}
                className={`${
                  searchedResultIndexes.includes(i) &&
                  state.searchedText.length > 0
                    ? "bg-yellow-200"
                    : ""
                }`}
              >
                {message.content}
              </p>
            )}
          </div>
          {i === filteredMessages.length - 1 && <div ref={lastMessageRef} />}
          {message.sender === currentUserId?.username &&
            menuState.id === message._id &&
            menuState.visible && (
              <MessageActions
                handleCopyText={() => handleCopyText(message.content)}
                handleDelete={handleDelete}
                setEditedMsg={setEditedMsg}
                currentMessage={message}
                messageActionsRef={messageActionsRef}
                filteredMessages={filteredMessages}
                index={i}
              />
            )}
        </div>
      ))}
    </div>
  );
}

export default Messages;
