"use client";

import React, { useContext } from "react";
import { Context } from "@/app/context/Context";
import { useRouter } from "next/navigation";

function Navbar() {
  const router = useRouter();
  const { isAuthenticated, setState } = useContext(Context)!;

  const handleSignOut = async () => {
    await fetch("../api/chat/signout", { method: "POST" });
    setState({ isAuthenticated: !isAuthenticated });
    router.push("/login");
  };

  return (
    <nav className="px-4 py-6 bg-blue-400 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <h2 className="text-xl">ChitChat</h2>
        <img
          src="/assets/chat-bubble.png"
          alt="chat-bubble-img"
          className="w-10"
        />
      </div>
      {isAuthenticated ? (
        <p className="cursor-pointer " onClick={handleSignOut}>
          Sign out
        </p>
      ) : (
        <p className="cursor-pointer " onClick={() => router.push("/login")}>
          Log in
        </p>
      )}
    </nav>
  );
}

export default Navbar;
