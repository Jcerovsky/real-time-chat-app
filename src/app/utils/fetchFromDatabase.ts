import React from "react";

export const fetchFromDatabase = async (
  path: string,
  setState: React.Dispatch<React.SetStateAction<any>>,
) => {
  const res = await fetch(`/api/${path}`);

  if (res.ok) {
    const data = await res.json();
    setState(data);
  }
};
