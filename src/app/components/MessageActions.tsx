import React from "react";

function MessageActions(props) {
  const { onDelete, onEdit, onReply, onCopy, onPin } = props;

  const handleCopyText = () => {
    navigator.clipboard.writeText(props.messageText);
    onCopy();
  };

  return (
    <div className="absolute top-0 right-0 z-50 p-2 rounded-lg bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white shadow-md">
      <ul className="space-y-2">
        <li
          className="cursor-pointer hover:bg-blue-700 p-1 rounded-md transition-colors duration-300"
          onClick={onDelete}
        >
          Delete
        </li>
        <li
          className="cursor-pointer hover:bg-blue-700 p-1 rounded-md transition-colors duration-300"
          onClick={onEdit}
        >
          Edit
        </li>
        <li
          className="cursor-pointer hover:bg-blue-700 p-1 rounded-md transition-colors duration-300"
          onClick={onReply}
        >
          Reply
        </li>
        <li
          className="cursor-pointer hover:bg-blue-700 p-1 rounded-md transition-colors duration-300"
          onClick={handleCopyText}
        >
          Copy Text
        </li>
        <li
          className="cursor-pointer hover:bg-blue-700 p-1 rounded-md transition-colors duration-300"
          onClick={onPin}
        >
          Pin
        </li>
      </ul>
    </div>
  );
}

export default MessageActions;
