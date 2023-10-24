"use client";

import React, { useContext } from "react";
import { Context } from "@/app/context/Context";
import { useRouter } from "next/navigation";
import Toggle from "@/app/components/Toggle";
import UserLogo from "@/app/components/UserLogo";

function Navbar() {
  const router = useRouter();
  const { isAuthenticated, setState } = useContext(Context)!;

  const handleSignOut = async () => {
    await fetch("../api/chat/signout", { method: "POST" });
    setState({ isAuthenticated: !isAuthenticated });
    router.push("/login");
  };

  return (
    <nav className="px-4 py-6 bg-blue-400 dark:bg-blue-500 flex justify-between items-center">
      <div className="flex items-center">
        <h2 className="text-xl mr-2">ChitChat</h2>
        <img
          src="/assets/chat-bubble.png"
          alt="chat-bubble-img"
          className="w-10 hover:rotate-12"
        />
      </div>
      {isAuthenticated && (
        <>
          <p className="cursor-pointer ml-auto mr-4" onClick={handleSignOut}>
            Sign out
          </p>
        </>
      )}
      <Toggle />
      <UserLogo />
    </nav>
  );
}

export default Navbar;
