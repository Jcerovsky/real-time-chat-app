import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  style?: string;
}

function Button({ children, style }: ButtonProps) {
  return (
    <button
      className={`py-3 px-4  rounded-md placeholder:ml-2 placeholder:font-light dark:bg-primary-dark dark:text-zinc-50
          w-full ${style}`}
    >
      {children}
    </button>
  );
}

export default Button;
