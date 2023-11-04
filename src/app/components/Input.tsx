import React from "react";

interface InputProps {
  name: string;
  placeholder: string;
  type?: string;
  value: string;

  setFormData?: (
    newState: Partial<{
      confirmPassword?: string;
      password: string;
      username: string;
    }>,
  ) => void;
}

function Input({
  name,
  placeholder,
  setFormData,
  value,
  type = "text",
}: InputProps) {
  const handleInputChange = (dataToBeChanged: string, value: string) => {
    setFormData!({ [dataToBeChanged]: value });
  };

  return (
    <div className="border-b border-gray mb-2">
      <label>
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          className="py-3 px-4  rounded-t-md placeholder:ml-2 placeholder:font-light dark:bg-primary-dark dark:text-zinc-50
          w-full hover:bg-gray-200 dark:hover:bg-neutral-500 duration-300"
          value={value}
          onChange={(e) => handleInputChange(e.target.name, e.target.value)}
          required={true}
        />
      </label>
    </div>
  );
}

export default Input;
