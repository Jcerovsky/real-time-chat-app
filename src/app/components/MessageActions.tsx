import React from "react";
import { EditedMessageProps } from "@/app/components/Messages";
import { MessageProps } from "@/app/interfaces/interfaces";

interface I {
  currentMessage: MessageProps;
  editedMsg: EditedMessageProps;
  editMsgRef: React.MutableRefObject<HTMLLIElement>;
  filteredMessages: MessageProps[];
  handleCopyText: () => void;
  handleDelete: () => void;
  index: number;
  messageActionsRef: React.RefObject<HTMLDivElement>;
  setEditedMsg: React.Dispatch<React.SetStateAction<EditedMessageProps | null>>;
}

function MessageActions({
  currentMessage,
  editedMsg,
  editMsgRef,
  filteredMessages,
  handleCopyText,
  handleDelete,
  index,
  messageActionsRef,
  setEditedMsg,
}: I) {
  const lastMessageStyle =
    filteredMessages.length - 1 === index
      ? "cursor-pointer hover:bg-blue-700 transition-colors duration-300"
      : "opacity-50";

  const handleEdit = () => {
    if (editedMsg === null) {
      setEditedMsg({
        ...currentMessage,
        isEdited: currentMessage.isEdited !== true,
      });
    } else {
      setEditedMsg({
        ...currentMessage,
        isEdited: !editedMsg.isEdited,
      });
    }
  };

  return (
    <div
      className={`absolute top-8 right-0 z-50 p-2 rounded-lg bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 
      text-white shadow-md w-36 text-center`}
      ref={messageActionsRef}
    >
      <ul className="space-y-2">
        <li
          className="cursor-pointer hover:bg-blue-700 p-1 rounded-md transition-colors duration-300 border-b-2"
          onClick={handleDelete}
        >
          Delete
        </li>
        <li
          className={`${lastMessageStyle} p-1 rounded-md  border-b-2`}
          onClick={handleEdit}
          ref={editMsgRef}
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
