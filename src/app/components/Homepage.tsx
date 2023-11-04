"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { Context } from "@/app/context/Context";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { io } from "socket.io-client";
import Users from "@/app/components/Users";
import useObjectState from "@/app/hooks/useObjectState";
import UserLogo from "@/app/components/UserLogo";
import Messages from "@/app/components/Messages";
import MessageInput from "@/app/components/MessageInput";
import {
  HomepageProps,
  MessageProps,
  UserProps,
} from "@/app/interfaces/interfaces";
import { saveMessageToDatabase } from "@/app/utils/saveMessageToDatabase";
import { fetchFromDatabase } from "@/app/utils/fetchFromDatabase";
import Image from "next/image";
import ChatOptions from "@/app/components/ChatOptions";

const socket = io("http://localhost:3000", { path: "/socket.io" });

function Homepage() {
  const router = useRouter();

  const { isAuthenticated, currentUser, setState } = useContext(Context)!;
  const [state, updateHomepageState] = useObjectState<HomepageProps>({
    currentChatUsers: [],
    isChatShownOnSmallScreen: false,
    isLoading: false,
    isSending: false,
    isSmallScreen: false,
    searchedIndex: 0,
    searchedResultsIndexes: [],
    searchedText: "",
    selectedUser: null,
    sentMessage: "",
    userList: [],
  });

  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [recentChats, setRecentChats] = useState<MessageProps[]>([]);

  const currentUserId = state.userList.find(
    (user) => user.username === currentUser,
  );

  const createRecentConversations = useCallback(() => {
    let uniqueConversations: MessageProps[] = [];
    let uniqueUser: { [key: string]: boolean } = {};
    const sortedRecentMessages = messages
      .filter(
        (msg) =>
          msg.sender === currentUserId?.username ||
          msg.to === currentUserId?.username,
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
  }, [currentUserId, messages]);

  useEffect(() => {
    createRecentConversations();
  }, [createRecentConversations]);

  useEffect(() => {
    Notification.requestPermission().catch((err) =>
      setState({ errorMessage: err }),
    );
  }, []);

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
      updateHomepageState({ selectedUser: chatUser });
    }
  }, [recentChats, currentUserId?.username, state.userList]);

  const fetchUsers = async () => {
    const API_URL = process.env.API_URL || "http://localhost:3000";
    const res = await fetch(`${API_URL}/api/users`);

    if (res.ok) {
      const data = await res.json();
      updateHomepageState({ userList: data });
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      (msg.to === state.selectedUser?.username &&
        msg.sender === currentUserId?.username) ||
      (msg.sender === state.selectedUser?.username &&
        msg.to === currentUserId?.username),
  );

  const handleSearch = useCallback(
    (searchedText: string) => {
      const results = filteredMessages
        .map((msg, index) =>
          msg.content.toLowerCase().includes(searchedText.toLowerCase())
            ? index
            : -1,
        )
        .filter((index) => index !== -1);
      updateHomepageState({
        searchedResultsIndexes: results,
        searchedIndex: 0,
      });
    },
    [filteredMessages],
  );

  useEffect(() => {
    handleSearch(state.searchedText);
  }, [state.searchedText]);

  const goToNextResult = () => {
    const nextIndex =
      (state.searchedIndex + 1) % state.searchedResultsIndexes.length;
    updateHomepageState({ searchedIndex: nextIndex });
  };

  useEffect(() => {
    fetchUsers().catch((err) => setState({ errorMessage: err }));
    fetchFromDatabase("messages", setMessages).catch((err) =>
      setState({ errorMessage: err }),
    );
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        if (window.innerWidth < 400) {
          updateHomepageState({ isSmallScreen: true });
        } else {
          updateHomepageState({
            isSmallScreen: false,
            isChatShownOnSmallScreen: false,
          });
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
    updateHomepageState({ isLoading: false });
  }, [isAuthenticated, currentUserId]);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      const newMessage = {
        sender: msg.sender,
        content: msg.content,
        to: msg.to,
      };

      setMessages((prevState) => [...prevState, newMessage]);

      if (currentUser !== msg.sender) {
        new Notification(`New message from ${msg.sender}`, {
          body: msg.content,
        });
      }
    });

    return () => void socket.off("receive_message");
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

        updateHomepageState({
          sentMessage: "",
          isSending: false,
        });
        setMessages((prevState) => [...prevState, payload]);
        socket.emit("message", payload);
        await fetchFromDatabase("messages", setMessages);
      } catch (err) {
        setState({ errorMessage: err as string });
      }
    }
  };

  const handleSelectUser = (user: UserProps) => {
    updateHomepageState({
      selectedUser: user,
      isChatShownOnSmallScreen: state.isSmallScreen
        ? true
        : state.isChatShownOnSmallScreen,
    });
    fetchFromDatabase("messages", setMessages).catch((err) =>
      setState({ errorMessage: err }),
    );
  };

  const showGoBack = state.isSmallScreen && state.isChatShownOnSmallScreen && (
    <div
      onClick={() => updateHomepageState({ isChatShownOnSmallScreen: false })}
      className="cursor-pointer hover:scale-95 duration-300"
    >
      <Image
        src="/assets/arrow-back.png"
        alt="go-back-arrow"
        width={24}
        height={24}
      />
    </div>
  );

  const NoRecentChats = () => {
    if (recentChats.length === 0 && !state.selectedUser) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-10 text-center">
          <Image
            src="/assets/empty-chat-icon.png"
            alt="No Chats"
            width={96}
            height={96}
            className=" mb-5"
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
  console.log("searhced", state.searchedText);

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

                  <ChatOptions
                    value={state.searchedText}
                    handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateHomepageState({ searchedText: e.target.value })
                    }
                    handleClick={goToNextResult}
                  />
                </div>
              )}
              <NoRecentChats />
              <Messages
                currentUserId={currentUserId}
                messages={messages}
                searchedResultIndexes={state.searchedResultsIndexes}
                filteredMessages={filteredMessages}
                setMessages={setMessages}
                state={state}
              />
            </div>
          </div>
          <MessageInput
            setState={updateHomepageState}
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
