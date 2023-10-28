import React from "react";

export const fetchFromDatabase = async (
  path: string,
  setState: React.Dispatch<React.SetStateAction<any>>,
) => {
  const API_URL = process.env.API_URL || "http://localhost:3000";
  const res = await fetch(`${API_URL}/api/${path}`);

  if (res.ok) {
    const data = await res.json();
    setState(data);
  }
};
