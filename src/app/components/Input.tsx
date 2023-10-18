import React from "react";

interface InputProps {
  placeholder: string;
}

function Input({ placeholder }: InputProps) {
  return (
    <div className={`border-b border-gray mb-2`}>
      <label>
        <input
          type="text"
          placeholder={placeholder}
          className="py-3 px-4  rounded-t-md placeholder:ml-2 placeholder:font-light dark:bg-primary-dark dark:text-zinc-50
          w-full hover:bg-gray-200 dark:hover:bg-neutral-500 duration-300"
        />
      </label>
    </div>
  );
}

export default Input;
