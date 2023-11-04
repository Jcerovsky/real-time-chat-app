import React, { useContext, useState } from "react";
import Image from "next/image";
import { MessageProps, UserProps } from "@/app/interfaces/interfaces";
import { Context } from "@/app/context/Context";
import { fetchFromDatabase } from "@/app/utils/fetchFromDatabase";

interface I {
  currentSearchIndex: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClick: (direction: string) => void;
  selectedUser: UserProps;
  setMessages: React.Dispatch<React.SetStateAction<MessageProps[]>>;
  totalSearchedResults: number[];
  value: string;
}

function ChatOptions({
  currentSearchIndex,
  handleChange,
  handleClick,
  selectedUser,
  setMessages,
  totalSearchedResults,
  value,
}: I) {
  const [isMenuShown, setIsMenuShown] = useState<boolean>(false);
  const { currentUser, setState } = useContext(Context)!;

  const handleDeleteChat = async () => {
    const API_URL = process.env.API_URL || "http://localhost:3000";
    const deletedChatUsers = {
      currentUser: currentUser,
      selectedUser: selectedUser,
    };
    const res = await fetch(`${API_URL}/api/chat/delete/`, {
      method: "DELETE",
      body: JSON.stringify(deletedChatUsers),
    });
    if (res.ok) {
      fetchFromDatabase("messages", setMessages).catch((err) =>
        setState({ errorMessage: err }),
      );
    }
  };

  return (
    <div className="relative ml-auto">
      <Image
        src="/assets/settings-img.png"
        alt="settings-wheel"
        className="cursor-pointer hover:rotate-45 duration-300"
        width={20}
        height={20}
        onClick={() => setIsMenuShown((prevState) => !prevState)}
      />
      {isMenuShown && (
        <form
          className="absolute top-4 right-6 shadow rounded-md p-4 bg-white dark:bg-gray-900 flex flex-col items-center gap-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex gap-2 items-center">
            <input
              placeholder="Search in conversation..."
              className="text-xs placeholder:ml-2 py-2 px-4 bg-zinc-50 hover:bg-gray-100 dark:bg-gray-800
              dark:hover:bg-gray-600 rounded-l-md truncate w-60 duration-300 "
              value={value}
              onChange={handleChange}
            />
            <div className="flex items-center border-l border-r px-2">
              <p className="text-xs">{currentSearchIndex}</p>
              <p className="text-xs">/</p>
              <p className="text-xs">
                {value.length === 0 ? 0 : totalSearchedResults.length}
              </p>
            </div>
            <button
              onClick={() => handleClick("previous")}
              className={`text-xs ${
                currentSearchIndex === 0 ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={currentSearchIndex === 0}
            >
              &#9650;
            </button>
            <button onClick={() => handleClick("next")} className="text-xs">
              &#9660;
            </button>
          </div>
          <button
            className="bg-red-500 hover:bg-red-400 text-sm py-2 px-4 rounded-md w-full "
            onClick={handleDeleteChat}
          >
            Delete chat
          </button>
        </form>
      )}
    </div>
  );
}

export default ChatOptions;
