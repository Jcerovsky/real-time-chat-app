"use client";

import React, { createContext, ReactNode } from "react";
import useObjectState from "@/app/hooks/useObjectState";
import getThemeFromLocalStorage from "@/app/utils/getThemeFromLocalStorage";

interface ContextProps {
  theme: "light" | "dark";
  setState: (state: Partial<ContextProps>) => void;
}

export const Context = createContext<ContextProps | null>(null);

function ContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useObjectState<ContextProps>({
    theme: getThemeFromLocalStorage("theme"),
    setState: () => {},
  });
  return (
    <Context.Provider value={{ theme: state.theme, setState }}>
      {children}
    </Context.Provider>
  );
}

export default ContextProvider;
