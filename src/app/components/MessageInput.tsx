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
        className="py-2 px-4 w-full flex-grow rounded-md placeholder:ml-2 placeholder:font-light bg-gray-100 truncate
            hover:bg-gray-200 duration-300 dark:bg-gray-700 dark:text-zinc-50 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
        placeholder="Type your message..."
        value={state.sentMessage}
        onChange={(e) => setState({ sentMessage: e.target.value })}
      />
      <Button
        style="w-1/4 text-xs sm:text-sm text-center ml-2 rounded-lg flex justify-center md:whitespace-nowrap"
        isDisabled={!state.sentMessage}
        text={"Start typing..."}
      >
        Send
      </Button>
    </form>
  );
}

export default MessageInput;
