"use client";

import React, { useContext, useEffect } from "react";
import { Context } from "@/app/context/Context";

function Toggle() {
  const { theme, setState } = useContext(Context)!;

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={theme === "dark"}
          onChange={() =>
            setState({ theme: theme === "dark" ? "light" : "dark" })
          }
        />
        <div
          className={`block w-10 h-6 rounded-full transition-colors duration-300 border border-neutral-700
          hover:bg-gray-500 dark:hover:bg-neutral-700 ${
            theme === "dark" ? "bg-neutral-600" : "bg-gray-400"
          }`}
        ></div>
        <div
          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${
            theme === "dark" && "transform translate-x-full bg-gray-600"
          }`}
        ></div>
      </div>
    </label>
  );
}

export default Toggle;
