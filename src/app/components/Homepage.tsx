"use client";

import React, { useContext, useEffect, useState } from "react";
import { Context } from "@/app/context/Context";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { io } from "socket.io-client";
import Users from "@/app/components/Users";
import useObjectState from "@/app/hooks/useObjectState";
import UserLogo from "@/app/components/UserLogo";
import Message from "@/app/components/Message";
import MessageInput from "@/app/components/MessageInput";
import {
  HomepageProps,
  MessageProps,
  UserProps,
} from "@/app/interfaces/interfaces";
import { saveMessageToDatabase } from "@/app/utils/saveMessageToDatabase";
import { fetchFromDatabase } from "@/app/utils/fetchFromDatabase";

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
    isSending: false,
    isChatShownOnSmallScreen: false,
    userList: [],
  });

  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [recentChats, setRecentChats] = useState<MessageProps[]>([]);

  const currentUserId = state.userList.find(
    (user) => user.username === currentUser,
  );

  const createRecentConversations = () => {
    let uniqueConversations: MessageProps[] = [];
    let uniqueUser: { [key: string]: boolean } = {};
    const sortedRecentMessages = messages
      .filter(
        (msg) =>
          msg.sender === currentUserId?.username ||
          msg.to === state.selectedUser?.username,
      )
      .reverse();

    sortedRecentMessages.forEach((msg) => {
      const otherUser =
        msg.sender === currentUserId?.username ? msg.to : msg.sender;
      if (!uniqueUser[otherUser]) {
        uniqueConversations.push(msg);
        uniqueUser[otherUser] = true;
      }
    });
    setRecentChats(uniqueConversations);
  };

  useEffect(() => {
    createRecentConversations();
  }, [messages]);

  useEffect(() => {
    if (recentChats.length > 0 && !state.selectedUser) {
      const mostRecentChat = recentChats[0];
      const mostRecentUsername =
        mostRecentChat.sender === currentUserId?.username
          ? mostRecentChat.to
          : mostRecentChat.sender;
      const chatUser = state.userList.find(
        (user) => user.username === mostRecentUsername,
      );
      setState({ selectedUser: chatUser });
    }
  }, [recentChats]);

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
    fetchFromDatabase("messages", setMessages);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        if (window.innerWidth < 400) {
          setState({ isSmallScreen: true });
        } else {
          setState({ isSmallScreen: false, isChatShownOnSmallScreen: false });
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

        setState({
          sentMessage: "",
          isSending: false,
        });
        setMessages((prevState) => [...prevState, payload]);

        socket.emit("message", payload);
      } catch (err) {
        console.log("Could not save to database:", err);
      }
    }
  };

  const handleSelectUser = (user: UserProps) => {
    setState({
      selectedUser: user,
      isChatShownOnSmallScreen: state.isSmallScreen
        ? true
        : state.isChatShownOnSmallScreen,
    });
    fetchFromDatabase("messages", setMessages);
  };

  const showGoBack = state.isSmallScreen && state.isChatShownOnSmallScreen && (
    <div
      onClick={() => setState({ isChatShownOnSmallScreen: false })}
      className="cursor-pointer hover:scale-95 duration-300"
    >
      <img src="/assets/arrow-back.png" alt="go-back-arrow" className="w-6" />
    </div>
  );

  const NoRecentChats = () => {
    if (recentChats.length === 0 && !state.selectedUser) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-10 text-center">
          <img
            src="/assets/empty-chat-icon.png"
            alt="No Chats"
            className="w-24 h-24 mb-5"
          />
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            No Recent Chats
          </h2>
          <p className="text-lg text-gray-500">
            To continue, find a user to message with.
          </p>
        </div>
      );
    }
  };

  if (state.isLoading) return <Loading />;

  return (
    <div
      className="bg-white w-full h-[30rem] overflow-y-scroll mt-5 rounded-md flex dark:bg-gray-800
    shadow"
    >
      {!state.isChatShownOnSmallScreen && (
        <div
          className={`${
            state.isSmallScreen ? "w-full" : "w-1/3 max-w-[13rem]"
          } p-4 flex flex-col`}
        >
          <Users
            userList={state.userList}
            handleSelectUser={handleSelectUser}
            recentChats={recentChats}
          />
        </div>
      )}

      {(!state.isSmallScreen || state.isChatShownOnSmallScreen) && (
        <div className="w-full h-full p-4 flex flex-col border-l dark:border-gray-600 ">
          <div
            className="flex-1 overflow-y-auto bg-gray-50 rounded-md dark:bg-gray-700 dark:text-zinc-50
        shadow"
          >
            <div className="relative">
              {state.selectedUser && (
                <div className="p-2 flex items-center justify-start mb-2 sticky top-0 z-10 bg-zinc-50 dark:bg-gray-800 shadow">
                  <div className="justify-self-start">{showGoBack}</div>
                  <UserLogo
                    user={state.selectedUser.username}
                    style={`${showGoBack && "ml-auto"} mr-2`}
                  />
                  <p>{state.selectedUser.username}</p>
                </div>
              )}
              <NoRecentChats />
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
            recentChats={recentChats}
            isSending={state.isSending}
          />
        </div>
      )}
    </div>
  );
}

export default Homepage;
