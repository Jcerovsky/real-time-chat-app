import React from "react";
import { NavbarProps } from "@/app/interfaces/interfaces";

interface I {
  navbarState: Partial<NavbarProps>;
  setNavbarState: (newState: Partial<NavbarProps>) => void;
}

function DeleteAccount({ navbarState, setNavbarState }: I) {
  return (
    <div
      className={` rounded-md py-2 px-4 bg-red-500 hover:bg-red-600 
                text-sm text-white ${
                  !navbarState.isSmallerScreen && "absolute top-8 right-4 w-36 "
                } ${
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
  );
}

export default DeleteAccount;
