import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MessageProps, UserProps } from "@/app/interfaces/interfaces";
import { Context } from "@/app/context/Context";
import { fetchFromDatabase } from "@/app/utils/fetchFromDatabase";
import DeleteConfirmation from "@/app/components/DeleteConfirmation";

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
  const [isConfirmingDeletion, setIsConfirmingDeletion] =
    useState<boolean>(false);
  const confirmDeletionRef = useRef<HTMLFormElement>(null);
  const deleteConfirmationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        confirmDeletionRef.current &&
        !confirmDeletionRef.current.contains(e.target as Node)
      ) {
        setIsMenuShown(false);
      }
      if (
        deleteConfirmationRef.current &&
        !deleteConfirmationRef.current.contains(e.target as Node)
      ) {
        setIsConfirmingDeletion(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const confirmDeletion = async (decision: string) => {
    if (decision === "confirm") {
      await handleDeleteChat();
      setIsMenuShown(false);
    }
    setIsConfirmingDeletion(false);
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
      {isConfirmingDeletion && (
        <DeleteConfirmation
          user={selectedUser.username}
          confirmDeletion={confirmDeletion}
          deleteConfirmationRef={deleteConfirmationRef}
        />
      )}
      {isMenuShown && (
        <form
          className="absolute top-0 right-14 shadow rounded-md p-4 bg-white dark:bg-gray-900 flex flex-col flex-shrink
          items-center gap-2 w-[10rem] sm:w-[20rem]"
          onSubmit={(e) => e.preventDefault()}
          ref={confirmDeletionRef}
        >
          <div className="flex flex-col sm:flex-row gap-2 items-center justify-center w-full">
            <input
              placeholder="Search in conversation..."
              className="text-xs placeholder:ml-2 py-2 px-4 bg-zinc-50 hover:bg-gray-100 dark:bg-gray-800
              dark:hover:bg-gray-600 rounded-md truncate duration-300 w-full "
              value={value}
              onChange={handleChange}
            />
            <div className="flex items-center border-l border-r px-2">
              <p className="text-xs">
                {totalSearchedResults.length === 0 ? 0 : currentSearchIndex + 1}
              </p>
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
            onClick={() => setIsConfirmingDeletion((prevState) => !prevState)}
          >
            Delete chat
          </button>
        </form>
      )}
    </div>
  );
}

export default ChatOptions;
