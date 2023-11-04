import React, { useState } from "react";
import Image from "next/image";

interface I {
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClick: () => void;
}
function ChatOptions({ value, handleChange, handleClick }: I) {
  const [isMenuShown, setIsMenuShown] = useState<boolean>(false);

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
          className="absolute top-4 right-6 shadow rounded-md p-4 bg-white dark:bg-gray-900"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            placeholder="Search in conversation..."
            className="text-xs placeholder:ml-2 py-2 px-4 bg-zinc-50 hover:bg-gray-100 dark:bg-gray-800
          dark:hover:bg-gray-600 rounded-md truncate w-60 duration-300"
            value={value}
            onChange={handleChange}
          />
          <button onClick={handleClick}>Next</button>
        </form>
      )}
    </div>
  );
}

export default ChatOptions;
