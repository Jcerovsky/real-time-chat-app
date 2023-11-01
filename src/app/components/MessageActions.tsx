import React from "react";
import { EditedMessageProps } from "@/app/components/Messages";
import { MessageProps } from "@/app/interfaces/interfaces";

interface I {
  handleDelete: () => void;
  handleCopyText: () => void;
  setEditedMsg: React.Dispatch<React.SetStateAction<EditedMessageProps | null>>;
  currentMessage: MessageProps;
}

function MessageActions({
  handleDelete,
  handleCopyText,
  setEditedMsg,
  currentMessage,
}: I) {
  const handleEditClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    e.stopPropagation();
    setEditedMsg({
      ...currentMessage,
      isEdited: !currentMessage.isEdited,
    });
  };

  return (
    <div
      className={`absolute top-8 right-0 z-50 p-2 rounded-lg bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 
      text-white shadow-md w-36 text-center`}
    >
      <ul className="space-y-2">
        <li
          className="cursor-pointer hover:bg-blue-700 p-1 rounded-md transition-colors duration-300 border-b-2"
          onClick={handleDelete}
        >
          Delete
        </li>
        <li
          className="cursor-pointer hover:bg-blue-700 p-1 rounded-md transition-colors duration-300 border-b-2"
          onClick={(e) => handleEditClick(e)}
        >
          Edit
        </li>
        <li
          className="cursor-pointer hover:bg-blue-700 p-1 rounded-md transition-colors duration-300 border-b-2"
          onClick={handleCopyText}
        >
          Copy Text
        </li>
      </ul>
    </div>
  );
}

export default MessageActions;
