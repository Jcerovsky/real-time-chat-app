import React from "react";

interface InputProps {
  placeholder: string;
  value: string;
  name: string;
  setFormData?: (
    newState: Partial<{
      username: string;
      password: string;
      confirmPassword?: string;
    }>,
  ) => void;
}

function Input({ placeholder, value, name, setFormData }: InputProps) {
  const handleInputChange = (dataToBeChanged: string, value: string) => {
    setFormData!({ [dataToBeChanged]: value });
  };

  return (
    <div className={`border-b border-gray mb-2`}>
      <label>
        <input
          type="text"
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
