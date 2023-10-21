"use client";

import React, { useContext } from "react";
import { Context } from "@/app/context/Context";

function Success() {
  const { successMessage } = useContext(Context)!;
  return (
    <div
      className={`p-2 py-4 rounded-md bg-green-200 dark:bg-green-400 border-2 border-red relative text-center ${
        !successMessage && "hidden"
      }`}
    >
      <h2 className="text-center text-xl mb-2">Success!</h2>
      <p className="tracking-widest text-sm opacity-70">{successMessage}</p>
    </div>
  );
}

export default Success;
