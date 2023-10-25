"use client";

import React, { useContext } from "react";
import { Context } from "@/app/context/Context";
import { useRouter } from "next/navigation";
import Toggle from "@/app/components/Toggle";
import UserLogo from "@/app/components/UserLogo";

function Navbar() {
  const router = useRouter();
  const { isAuthenticated, setState, currentUser } = useContext(Context)!;

  const handleSignOut = async () => {
    await fetch("../api/chat/signout", { method: "POST" });
    setState({ isAuthenticated: !isAuthenticated, currentUser: "" });
    router.push("/login");
  };

  return (
    <nav className="px-8 py-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 flex justify-between items-center shadow-md">
      <div className="flex items-center">
        <h2 className="text-2xl text-white font-bold tracking-wider mr-4">
          ChitChat
        </h2>
        <img
          src="/assets/chat-bubble.png"
          alt="chat-bubble-img"
          className="w-10 transform transition-transform duration-300 hover:rotate-12"
        />
      </div>
      {isAuthenticated && (
        <p
          className="cursor-pointer text-white hover:text-gray-300 transition-colors duration-300 ml-auto mr-4"
          onClick={handleSignOut}
        >
          Sign out
        </p>
      )}
      <Toggle />
      <UserLogo user={currentUser} />
    </nav>
  );
}

export default Navbar;
