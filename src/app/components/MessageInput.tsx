import React, { useRef } from "react";
import Button from "@/app/components/Button";
import { HomepageProps, MessageProps } from "@/app/interfaces/interfaces";

interface I {
  sendMessage: (e: React.FormEvent) => void;
  state: HomepageProps;
  setState: (newState: Partial<HomepageProps>) => void;
  recentChats: MessageProps[];
}

function MessageInput({ sendMessage, state, setState, recentChats }: I) {
  return (
    <form className="flex mt-4 h-10" onSubmit={sendMessage}>
      <input
        type="text"
        className="py-1 px-4 w-full rounded-md placeholder:ml-2 placeholder:font-light bg-gray-100 truncate
            hover:bg-gray-100 dark:hover:bg-gray-600 duration-300 dark:bg-gray-700 dark:text-zinc-50 shadow text-sm sm:text-sm
           "
        placeholder="Type your message..."
        value={state.sentMessage}
        onChange={(e) => setState({ sentMessage: e.target.value })}
      />
      <Button
        customStyle="w-1/4 text-xs text-left ml-2 mt-auto h-10 rounded-lg flex justify-center items-center
        md:whitespace-nowrap"
        isDisabled={
          !state.sentMessage ||
          (recentChats.length === 0 && !state.selectedUser)
        }
        text={"Start typing..."}
      >
        Send
      </Button>
    </form>
  );
}

export default MessageInput;
