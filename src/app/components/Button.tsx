import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  customStyle?: string;
  isDisabled: boolean;
  text?: string;
}

function Button({ children, customStyle, isDisabled, text }: ButtonProps) {
  return (
    <button
      className={`rounded-md placeholder:ml-2 font-medium bg-[#1F485B] bg-primary-dark dark:text-zinc-50
          text-zinc-50 dark:bg-[#4b6c7b] hover:bg-[#4b6c7b] dark:hover:bg-[#4b6c8b] duration-300 disabled:opacity-50 ${customStyle}`}
      disabled={isDisabled}
      type={"submit"}
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
