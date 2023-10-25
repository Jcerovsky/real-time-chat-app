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
  const [sentMessage, setSentMessage] = useState<string>("");
  const [receivedMessage, setReceivedMessage] = useState<string>("");
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    window.innerWidth < 400,
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        if (window.innerWidth < 400) {
          setIsSmallScreen(true);
        } else {
          setIsSmallScreen(false);
        }
      };

      handleResize();

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
    setIsLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setReceivedMessage(msg);
    });
  }, [socket]);

  const sendMessage = () => {
    socket.emit("message", sentMessage);
  };

  if (isLoading) return <Loading />;

  return (
    <div
      className="bg-white w-full h-[30rem] overflow-y-scroll mt-5 rounded-md flex dark:bg-gray-800
    shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
    >
      <div
        className={`${
          isSmallScreen ? "w-full" : "w-1/3 max-w-[13rem]"
        } p-4 flex flex-col`}
      >
        <Users />
      </div>

      {!isSmallScreen && (
        <div className="w-2/3 h-full p-4 flex flex-col border-l dark:border-gray-600 ">
          <div
            className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded-md dark:bg-gray-700 dark:text-zinc-50
        shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
          >
            {receivedMessage}
          </div>
          <div className="flex mt-4">
            <input
              type="text"
              className="py-2 px-4 w-3/4 flex-grow rounded-md placeholder:ml-2 placeholder:font-light bg-gray-100 truncate
            hover:bg-gray-200 duration-300 dark:bg-gray-700 dark:text-zinc-50 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
              placeholder="Type your message..."
              value={sentMessage}
              onChange={(e) => setSentMessage(e.target.value)}
            />
            <Button
              style="w-1/4 text-xs sm:text-sm text-center ml-2 rounded-lg flex justify-center whitespace-nowrap"
              onClick={sendMessage}
              isDisabled={!sentMessage}
            >
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Homepage;
