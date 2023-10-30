"use client";

import React, { useContext, useEffect, useState } from "react";
import { Context } from "@/app/context/Context";
import { useRouter } from "next/navigation";
import Toggle from "@/app/components/Toggle";
import UserLogo from "@/app/components/UserLogo";

function Navbar() {
  const router = useRouter();
  const { isAuthenticated, setState, currentUser } = useContext(Context)!;
  const [isSmallerScreen, setIsSmallerScreen] = useState<boolean>(false);
  const [isMenuShown, setIsMenuShown] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        if (window.innerWidth < 500) {
          setIsSmallerScreen(true);
        } else {
          setIsSmallerScreen(false);
          setIsMenuShown(false);
        }
      };
      handleResize();

      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handleSignOut = async () => {
    await fetch("../api/chat/signout", { method: "POST" });
    setState({ isAuthenticated: !isAuthenticated, currentUser: "" });
    router.push("/login");
  };

  const NavbarItems = () => {
    return (
      <div
        className={`${
          !isMenuShown ? " items-center" : "flex-col-reverse gap-2 items-end "
        } flex space-x-4 md:space-x-6 transition-all duration-500 ease-in-out `}
      >
        {isAuthenticated && (
          <p
            className={`
              cursor-pointer  hover:text-gray-300 transition-colors duration-300 ${
                isMenuShown ? "text-gray-800" : "text-white"
              }
            `}
            onClick={handleSignOut}
          >
            Sign out
          </p>
        )}
        <Toggle />
        <UserLogo user={currentUser} />
      </div>
    );
  };

  return (
    <nav className="px-10 py-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 flex justify-between items-center shadow-lg">
      <div className="flex items-center space-x-4 relative">
        <h2 className="text-3xl text-white font-extrabold tracking-tight">
          ChitChat
        </h2>
        <img
          src="/assets/chat-bubble.png"
          alt="chat-bubble-img"
          className="w-12 duration-300 hover:rotate-12"
        />
      </div>
      {isSmallerScreen ? (
        <img
          src="/assets/menu-bar.png"
          alt="menu-bar"
          className="w-8 cursor-pointer hover:scale-95"
          onClick={() => setIsMenuShown((prevState) => !prevState)}
        />
      ) : (
        <NavbarItems />
      )}
      {isMenuShown && isSmallerScreen && (
        <div className=" absolute right-5 top-16 z-30 p-5 rounded-lg bg-blue-100 dark:bg-blue-300 text-white w-32 shadow">
          <NavbarItems />
        </div>
      )}
    </nav>
  );
}

export default Navbar;
