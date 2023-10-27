import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  style?: string;
  isDisabled: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  text?: string;
}

function Button({ children, style, onClick, isDisabled, text }: ButtonProps) {
  return (
    <button
      className={`py-3 px-4  rounded-md placeholder:ml-2 font-medium bg-[#1F485B] bg-primary-dark dark:text-zinc-50
          w-full text-zinc-50 dark:bg-[#4b6c7b] hover:bg-[#4b6c7b] dark:hover:bg-[#4b6c8b] duration-300 disabled:opacity-50 ${style}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {isDisabled && !text
        ? "Loading..."
        : isDisabled && text
        ? text
        : children}
    </button>
  );
}

export default Button;
