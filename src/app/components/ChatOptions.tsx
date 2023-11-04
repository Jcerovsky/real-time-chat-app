import React from "react";

interface I {
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClick: () => void;
}

function ChatOptions({ value, handleChange, handleClick }: I) {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <input
        placeholder="Search in conversation"
        value={value}
        onChange={(e) => handleChange(e)}
      />
      <button onClick={handleClick}>Next</button>
    </form>
  );
}

export default ChatOptions;
