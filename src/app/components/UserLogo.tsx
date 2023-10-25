import React, { useContext } from "react";
import { Context } from "@/app/context/Context";
import createUserInitials from "@/app/utils/createUserInitials";

function UserLogo({ user }: { user: string }) {
  const { currentUser } = useContext(Context)!;

  return (
    <div
      className={`w-8 h-8 rounded-full p-4 flex items-center justify-center 
        bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg 
        text-white font-semibold ${!currentUser && "hidden"}`}
    >
      {createUserInitials(user)}
    </div>
  );
}

export default UserLogo;
