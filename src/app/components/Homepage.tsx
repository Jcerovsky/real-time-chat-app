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
import Message from "@/app/components/Message";
import MessageInput from "@/app/components/MessageInput";

export interface UserProps {
  username: string;
  _id: string;
}

export interface MessageProps {
  sender: string;
  content: string;
  to: string;
}

export interface HomepageProps {
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
  const [state, setState] = useObjectState<HomepageProps>({
    isLoading: false,
    sentMessage: "",
    selectedUser: null,
    isSmallScreen: false,
    currentChatUsers: [],
    userList: [],
  });

  const [messages, setMessages] = useState<MessageProps[]>([]);

  const currentUserId = state.userList.find(
    (user) => user.username === currentUser,
  );

  const saveMessageToDatabase = async (messageData: MessageProps) => {
    const API_URL = process.env.API_URL || "http://localhost:3000";
    const res = await fetch(`${API_URL}/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });
    if (res.ok) {
      return await res.json();
    } else {
      throw new Error("Could not save to database");
    }
  };

  const fetchUsers = async () => {
    const API_URL = process.env.API_URL || "http://localhost:3000";
    const res = await fetch(`${API_URL}/api/users`);

    if (res.ok) {
      const data = await res.json();
      setState({ userList: data });
    }
  };

  const fetchMessages = async () => {
    const API_URL = process.env.API_URL || "http://localhost:3000";
    const res = await fetch(`${API_URL}/api/messages`);

    if (res.ok) {
      const data = await res.json();
      setMessages(data);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchMessages();
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
    socket.emit("register", currentUserId?.username);
    setState({ isLoading: false });
  }, [isAuthenticated, currentUserId]);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      const newMessage = {
        sender: msg.sender,
        content: msg.content,
        to: msg.to,
      };

      setMessages((prevState) => [...prevState, newMessage]);
    });

    return () => socket.off("receive_message");
  }, [socket]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUserId && state.selectedUser?.username) {
      const payload = {
        content: state.sentMessage,
        to: state.selectedUser.username,
        sender: currentUserId.username,
      };
      try {
        await saveMessageToDatabase(payload);

        setState({ sentMessage: "" });
        setMessages((prevState) => [...prevState, payload]);

        socket.emit("message", payload);
      } catch (err) {
        console.log("Could not save to database:", err);
      }
    }
  };

  const handleSelectUser = (user: UserProps) => {
    setState({ selectedUser: user });
    fetchMessages();
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
                  <UserLogo user={state.selectedUser.username} />
                  <p>{state.selectedUser.username}</p>
                </div>
              )}
              <Message
                currentUserId={currentUserId}
                messages={messages}
                state={state}
              />
            </div>
          </div>
          <MessageInput
            setState={setState}
            state={state}
            sendMessage={sendMessage}
          />
        </div>
      )}
    </div>
  );
}

export default Homepage;
