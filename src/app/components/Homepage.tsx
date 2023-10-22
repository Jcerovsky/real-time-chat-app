"use client";

import React, { useContext, useEffect, useState } from "react";
import { Context } from "@/app/context/Context";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import Button from "@/app/components/Button";
import { io } from "socket.io-client";

function Homepage() {
  const socket = io();
  const router = useRouter();
  let ws;

  const { isAuthenticated } = useContext(Context)!;
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
    setIsLoading(false);
    ws = new WebSocket("http://localhost:3000/");

    ws.addEventListener("open", (event) => {
      ws.send("Hello server");
    });

    ws.addEventListener("message", (event) => {
      console.log("Received", event.data);
    });
  }, [isAuthenticated]);

  const sendMessage = () => {
    if (ws) {
      ws.send("Client message");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="bg-white w-3/4 ml-auto mr-auto shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] rounded-md">
      <div className="flex mt-10">
        <input
          type="text"
          className="py-3 px-4 rounded-md placeholder:ml-2 placeholder:font-light dark:bg-primary-dark dark:text-zinc-50
          w-full hover:bg-gray-200 dark:hover:bg-neutral-500 duration-300"
          placeholder="Type your message..."
        />
        <Button style="w-16 ml-auto rounded-l-none">Send</Button>
      </div>
    </div>
  );
}

export default Homepage;
