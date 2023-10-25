"use client";

import React, { useContext, useEffect, useState } from "react";
import { Context } from "@/app/context/Context";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import Button from "@/app/components/Button";
import { io } from "socket.io-client";
import Users from "@/app/components/Users";
import useObjectState from "@/app/hooks/useObjectState";
import UserLogo from "@/app/components/UserLogo";

export interface UserProps {
  username: string;
  _id: string;
}

interface Message {
  sender: string;
  content: string;
  to: string;
}

interface I {
  isLoading: boolean;
  sentMessage: string;
  isSmallScreen: boolean;
  currentChatUsers: string[];
  selectedUser: UserProps | null;
  userList: UserProps[];
}

const socket = io("http://localhost:3000", { path: "/socket.io" });

function Homepage() {
  const router = useRouter();

  const { isAuthenticated, currentUser } = useContext(Context)!;
  const [state, setState] = useObjectState<I>({
    isLoading: false,
    sentMessage: "",
    selectedUser: null,
    isSmallScreen: false,
    currentChatUsers: [],
    userList: [],
  });

  const [messages, setMessages] = useState<Message[]>([]);

  const fetchUsers = async () => {
    const API_URL = process.env.API_URL || "http://localhost:3000";
    const res = await fetch(`${API_URL}/api/users`);

    if (res.ok) {
      const data = await res.json();
      setState({ userList: data });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        if (window.innerWidth < 400) {
          setState({ isSmallScreen: true });
        } else {
          setState({ isSmallScreen: false });
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
    socket.emit("register", currentUserId);
    setState({ isLoading: false });
  }, [isAuthenticated]);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      const newMessage = {
        sender: "them",
        content: msg.content,
        to: msg.to,
      };
      setMessages((prevState) => [...prevState, newMessage]);
    });
  }, [socket]);

  const currentUserId = state.userList.find(
    (user) => user.username === currentUser,
  );

  const sendMessage = () => {
    const payload = { content: state.sentMessage, to: state.selectedUser?._id };
    socket.emit("message", payload);

    const sentMessage = {
      content: state.sentMessage,
      sender: "me",
      to: state.selectedUser!.username,
    };
    setState({ sentMessage: "" });
    setMessages((prevState) => [...prevState, sentMessage]);
  };

  const handleSelectUser = (user: UserProps) => {
    setState({ selectedUser: user });
  };

  if (state.isLoading) return <Loading />;

  return (
    <div
      className="bg-white w-full h-[30rem] overflow-y-scroll mt-5 rounded-md flex dark:bg-gray-800
    shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
    >
      <div
        className={`${
          state.isSmallScreen ? "w-full" : "w-1/3 max-w-[13rem]"
        } p-4 flex flex-col`}
      >
        <Users userList={state.userList} handleSelectUser={handleSelectUser} />
      </div>

      {!state.isSmallScreen && (
        <div className="w-2/3 h-full p-4 flex flex-col border-l dark:border-gray-600 ">
          <div
            className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded-md dark:bg-gray-700 dark:text-zinc-50
        shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
          >
            <div>
              {state.selectedUser && (
                <div className="border-b dark:border-gray-600 p-2 flex justify-between mb-2">
                  <UserLogo user={state.selectedUser.username} />{" "}
                  <p>{state.selectedUser.username}</p>
                </div>
              )}
              {messages
                .filter((msg) => msg.to === state.selectedUser?.username)
                .map((message, i) => (
                  <div
                    key={i}
                    className={`flex mb-2 font-medium ${
                      message.sender === "me" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <p
                      className={`rounded-md py-1 px-2 ${
                        message.sender === "me" ? "bg-blue-400" : "bg-gray-300"
                      }`}
                    >
                      {message.content}
                    </p>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex mt-4">
            <input
              type="text"
              className="py-2 px-4 w-3/4 flex-grow rounded-md placeholder:ml-2 placeholder:font-light bg-gray-100 truncate
            hover:bg-gray-200 duration-300 dark:bg-gray-700 dark:text-zinc-50 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
              placeholder="Type your message..."
              value={state.sentMessage}
              onChange={(e) => setState({ sentMessage: e.target.value })}
            />
            <Button
              style="w-1/4 text-xs sm:text-sm text-center ml-2 rounded-lg flex justify-center whitespace-nowrap"
              onClick={sendMessage}
              isDisabled={!state.sentMessage}
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
