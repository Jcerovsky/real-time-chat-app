import React, { useRef } from "react";
import Button from "@/app/components/Button";
import { HomepageProps } from "@/app/interfaces/interfaces";

interface I {
  sendMessage: (e: React.FormEvent) => void;
  state: HomepageProps;
  setState: (newState: Partial<HomepageProps>) => void;
}

function MessageInput({ sendMessage, state, setState }: I) {
  return (
    <form className="flex mt-4" onSubmit={sendMessage}>
      <input
        type="text"
        className="py-1 px-4 w-full rounded-md placeholder:ml-2 placeholder:font-light bg-gray-100 truncate
            hover:bg-gray-200 duration-300 dark:bg-gray-700 dark:text-zinc-50 shadow text-sm sm:text-sm"
        placeholder="Type your message..."
        value={state.sentMessage}
        onChange={(e) => setState({ sentMessage: e.target.value })}
      />
      <Button
        style="w-1/4 text-xs sm:text-sm text-left ml-2 rounded-lg flex justify-center md:whitespace-nowrap"
        isDisabled={!state.sentMessage}
        text={"Start typing..."}
      >
        Send
      </Button>
    </form>
  );
}

export default MessageInput;
