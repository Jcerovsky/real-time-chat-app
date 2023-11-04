"use client";

import React, { createContext, ReactNode } from "react";
import useObjectState from "@/app/hooks/useObjectState";
import getThemeFromLocalStorage from "@/app/utils/getThemeFromLocalStorage";

interface ContextProps {
  currentUser: string;
  errorMessage: string;
  isAuthenticated: boolean;
  setState: (state: Partial<ContextProps>) => void;
  successMessage: string;
  theme: string;
}

export const Context = createContext<ContextProps | null>(null);

function ContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useObjectState<ContextProps>({
    currentUser: "",
    errorMessage: "",
    isAuthenticated: false,
    successMessage: "",
    theme: getThemeFromLocalStorage("theme"),
    setState: () => {},
  });

  return (
    <Context.Provider
      value={{
        currentUser: state.currentUser,
        errorMessage: state.errorMessage,
        isAuthenticated: state.isAuthenticated,
        successMessage: state.successMessage,
        theme: state.theme,
        setState,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default ContextProvider;
