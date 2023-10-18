import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  style?: string;
}

function Button({ children, style }: ButtonProps) {
  return (
    <button
      className={`py-3 px-4  rounded-md placeholder:ml-2 font-medium bg-[#1F485B] dark:bg-primary-dark dark:text-zinc-50
          w-full text-zinc-50 hover:bg-[#4b6c7b] duration-300 ${style}`}
    >
      {children}
    </button>
  );
}

export default Button;
