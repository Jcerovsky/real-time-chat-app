import React, { useState } from "react";

function UseObjectState<T>(
  initialState: T,
): [T, (newState: Partial<T>) => void] {
  const [state, setState] = useState(initialState);

  const updateState = (newState: Partial<T>) => {
    setState((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  return [state, updateState];
}

export default UseObjectState;
