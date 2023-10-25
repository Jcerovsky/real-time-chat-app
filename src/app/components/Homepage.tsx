"use client";

import React, { useContext, useEffect, useState } from "react";
import { Context } from "@/app/context/Context";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import Button from "@/app/components/Button";
import { io } from "socket.io-client";
import Users from "@/app/components/Users";

const socket = io("http://localhost:3000", { path: "/socket.io" });

function Homepage() {
  const router = useRouter();

  const { isAuthenticated } = useContext(Context)!;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
    setIsLoading(false);
  }, [isAuthenticated]);

  const sendMessage = () => {
    socket.emit("message", message);
  };

  if (isLoading) return <Loading />;

  return (
    <div
      className="bg-white w-3/4 h-[30rem] overflow-y-scroll mt-5 ml-auto mr-auto shadow-md rounded-md flex dark:bg-gray-800
    shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
    >
      <div className="w-1/3 p-4 flex flex-col">
        <Users />
      </div>

      <div className="w-2/3 h-full p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded-md"></div>
        <div className="flex mt-4">
          <input
            type="text"
            className="py-2 px-4 flex-grow rounded-md placeholder:ml-2 placeholder:font-light bg-gray-100 hover:bg-gray-200 duration-300"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            style="w-16 ml-2 rounded"
            onClick={sendMessage}
            isDisabled={!message}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
