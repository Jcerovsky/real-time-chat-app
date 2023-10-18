"use client";

import React, { createContext, ReactNode, useState } from "react";

interface ContextProps {
  theme: "light" | "dark";
  setState: (state: Partial<ContextProps>) => void;
}

export const Context = createContext<ContextProps | null>(null);

function ContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ContextProps>({
    theme: "light",
    setState: () => {},
  });
  return (
    <Context.Provider value={{ theme: state.theme, setState }}>
      {children}
    </Context.Provider>
  );
}

export default ContextProvider;
