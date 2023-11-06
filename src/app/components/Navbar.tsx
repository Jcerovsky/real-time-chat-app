"use client";

import React, { useContext, useEffect, useRef } from "react";
import { Context } from "@/app/context/Context";
import { useRouter } from "next/navigation";
import Toggle from "@/app/components/Toggle";
import UserLogo from "@/app/components/UserLogo";
import Image from "next/image";
import DeleteConfirmation from "@/app/components/DeleteConfirmation";
import useObjectState from "@/app/hooks/useObjectState";

function Navbar() {
  const router = useRouter();
  const { isAuthenticated, setState, currentUser } = useContext(Context)!;
  const menuRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const deleteConfirmationRef = useRef<HTMLDivElement>(null);

  const [navbarState, setNavbarState] = useObjectState({
    isSmallerScreen: false,
    isMenuShown: false,
    confirmDeletingUser: false,
    isDeleteOptionVisible: false,
    isLoading: false,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        if (window.innerWidth < 500) {
          setNavbarState({ isSmallerScreen: true });
        } else {
          setNavbarState({ isSmallerScreen: false, isMenuShown: false });
        }
      };
      handleResize();

      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        imgRef.current &&
        !imgRef.current.contains(event.target as Node)
      ) {
        setNavbarState({ isMenuShown: false });
      }
      if (
        deleteConfirmationRef.current &&
        !deleteConfirmationRef.current.contains(event.target as Node)
      ) {
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  const handleSignOut = async () => {
    setNavbarState({ isLoading: true });
    await fetch("../api/users/signout", { method: "POST" });
    setState({ isAuthenticated: !isAuthenticated, currentUser: "" });
    setNavbarState({ isLoading: false });
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    setNavbarState({ isLoading: true });
    const API_URL = process.env.API_URL || "http://localhost:3000";
    try {
      const res = await fetch(`${API_URL}/api/users/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentUser),
      });
      if (res.ok) {
        setState({
          successMessage: `Account deleted successfully. We're sorry to see you go.`,
        });
        setTimeout(() => {
          handleSignOut();
        }, 1000);
      }
    } catch (err) {
      setState({ errorMessage: err as string });
    }
    setNavbarState({ isLoading: false });
  };

  const confirmDeletion = async (decision: string) => {
    if (decision === "confirm") {
      await handleDeleteAccount();
    }
    setNavbarState({ confirmDeletingUser: false });
  };

  const NavbarItems = () => {
    return (
      <div
        className={`${
          !navbarState.isMenuShown
            ? " items-center"
            : "flex-col-reverse gap-3 items-center "
        } flex space-x-4 md:space-x-6 transition-all duration-500 ease-in-out `}
      >
        {isAuthenticated && (
          <p
            className={` hover:text-gray-300 transition-colors duration-300  ${
              navbarState.isMenuShown ? "text-gray-800" : "text-white"
            } ${
              navbarState.isLoading
                ? "cursor-wait opacity-70"
                : "cursor-pointer"
            }
            `}
            onClick={handleSignOut}
          >
            Sign out
          </p>
        )}
        <Toggle />
        <div
          className="relative cursor-pointer"
          onMouseEnter={() => setNavbarState({ isDeleteOptionVisible: true })}
          onMouseLeave={() => setNavbarState({ isDeleteOptionVisible: false })}
        >
          <UserLogo user={currentUser} />
          {navbarState.isDeleteOptionVisible && (
            <div
              className={`absolute top-8 -right-4 w-32 rounded-md py-2 px-4 bg-red-500 hover:bg-red-600 
                text-sm text-white ${
                  navbarState.isLoading
                    ? "cursor-wait opacity-70"
                    : "cursor-pointer"
                } `}
              onClick={() =>
                setNavbarState({
                  confirmDeletingUser: !navbarState.confirmDeletingUser,
                })
              }
            >
              <p>Delete account</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <nav
      className=" px-5 py-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 flex justify-between items-center
    shadow-lg relative"
    >
      <div className="flex items-center space-x-4 relative">
        <h2 className="text-3xl text-white font-extrabold tracking-tight">
          ChitChat
        </h2>
        <Image
          src="/assets/chat-bubble.png"
          alt="chat-bubble-img"
          width={40}
          height={40}
          className=" duration-300 hover:rotate-12"
        />
      </div>
      {navbarState.isSmallerScreen ? (
        <Image
          src="/assets/menu-bar.png"
          alt="menu-bar"
          width={30}
          height={30}
          ref={imgRef}
          className=" cursor-pointer hover:scale-95"
          onClick={() =>
            setNavbarState({ isMenuShown: !navbarState.isMenuShown })
          }
        />
      ) : (
        <NavbarItems />
      )}
      {navbarState.isMenuShown && navbarState.isSmallerScreen && (
        <div
          className=" absolute right-5 top-16 z-30 p-5 rounded-lg bg-blue-100 dark:bg-blue-300 text-white w-42 shadow"
          ref={menuRef}
        >
          <NavbarItems />
        </div>
      )}
      {navbarState.confirmDeletingUser && (
        <DeleteConfirmation
          confirmDeletion={confirmDeletion}
          content={
            "Are you sure you want to delete your account? This action will also delete all messages you sent and it is not reversible."
          }
          deleteConfirmationRef={deleteConfirmationRef}
        />
      )}
    </nav>
  );
}

export default Navbar;
