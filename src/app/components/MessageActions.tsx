import React from "react";

interface I {
  handleDelete: () => void;
  handleCopyText: () => void;
}

function MessageActions({ handleDelete, handleCopyText }: I) {
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
        <li className="cursor-pointer hover:bg-blue-700 p-1 rounded-md transition-colors duration-300 border-b-2">
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
