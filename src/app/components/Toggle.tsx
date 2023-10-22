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
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        value=""
        className="sr-only peer"
        checked={theme === "dark"}
        onChange={() =>
          setState({ theme: theme === "dark" ? "light" : "dark" })
        }
      />
      <div
        className="w-9 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300
            dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full
            peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px]
            after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all
            dark:border-gray-600 peer-checked:bg-blue-600 duration-300"
      />
      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300" />
    </label>
  );
}

export default Toggle;
