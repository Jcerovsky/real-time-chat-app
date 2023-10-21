"use client";

import React, { createContext, ReactNode } from "react";
import useObjectState from "@/app/hooks/useObjectState";
import getThemeFromLocalStorage from "@/app/utils/getThemeFromLocalStorage";

interface ContextProps {
  theme: "light" | "dark";
  errorMessage: string;
  setState: (state: Partial<ContextProps>) => void;
}

export const Context = createContext<ContextProps | null>(null);

function ContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useObjectState<ContextProps>({
    theme: getThemeFromLocalStorage("theme"),
    errorMessage: "",
    setState: () => {},
  });
  return (
    <Context.Provider
      value={{ theme: state.theme, setState, errorMessage: state.errorMessage }}
    >
      {children}
    </Context.Provider>
  );
}

export default ContextProvider;
