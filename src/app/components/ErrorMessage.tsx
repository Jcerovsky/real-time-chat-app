"use client";

import React, { useContext } from "react";
import { Context } from "@/app/context/Context";

function ErrorMessage() {
  const { errorMessage, setState } = useContext(Context)!;

  return (
    <div
      className={`p-2 py-4 rounded-md bg-red-200 dark:bg-red-400 border-2 border-red relative text-center ${
        !errorMessage && "hidden"
      }`}
    >
      <h2 className="text-center text-xl mb-2">Oh no!</h2>
      <p className="tracking-widest text-sm opacity-70">{errorMessage}</p>
      <span
        className="absolute top-1 right-2 cursor-pointer hover:bg-neutral-700 hover:text-white rounded-full h-6 w-6
        text-center duration-300"
        onClick={() => setState({ errorMessage: "" })}
      >
        X
      </span>
    </div>
  );
}

export default ErrorMessage;
