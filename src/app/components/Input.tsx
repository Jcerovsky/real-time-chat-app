import React, { ReactNode } from "react";

interface InputProps {
  placeholder: string;
}

function Input({ placeholder }: InputProps) {
  return (
    <div className="border-b border-gray cursor-pointer ">
      <label>
        <input
          type="text"
          placeholder={placeholder}
          className="py-3 px-4  rounded-md placeholder:ml-2 placeholder:font-light dark:bg-primary-dark dark:text-zinc-50"
        />
      </label>
    </div>
  );
}

export default Input;
