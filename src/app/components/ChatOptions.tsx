import React, { useState } from "react";
import Image from "next/image";

interface I {
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClick: () => void;
}

function ChatOptions({ value, handleChange, handleClick }: I) {
  const [isMenuShown, setIsMenuShown] = useState<boolean>(false);

  const Menu = () => {
    return (
      <form className="absolute top-4 right-6 shadow rounded-md p-4 bg-white dark:bg-gray-900">
        <input
          placeholder="Search in conversation..."
          className="text-xs placeholder:ml-2 py-2 px-4 bg-zinc-50 hover:bg-gray-100 dark:bg-gray-800
          dark:hover:bg-gray-600 rounded-md truncate w-20 md:w-60 duration-300"
          value={value}
          onChange={handleChange}
        />
        <button onClick={handleClick}>Next</button>
      </form>
    );
  };

  const SettingsImage = () => {
    return (
      <Image
        src="/assets/settings-img.png"
        alt="settings-wheel"
        className="cursor-pointer hover:rotate-45 duration-300"
        width={20}
        height={20}
        onClick={() => setIsMenuShown((prevState) => !prevState)}
      />
    );
  };

  return (
    <div className="relative ml-auto">
      {isMenuShown ? (
        <>
          <SettingsImage />
          <Menu />
        </>
      ) : (
        <SettingsImage />
      )}
    </div>
  );
}

export default ChatOptions;
