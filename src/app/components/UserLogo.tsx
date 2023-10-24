"use client";

import React, { useContext } from "react";
import { Context } from "@/app/context/Context";

function UserLogo() {
  const { currentUser } = useContext(Context)!;
  return (
    <div className={`w-10 h-10 rounded-full ${!currentUser && "hidden"}`}>
      {createUserInitials(currentUser)}
    </div>
  );
}

export default UserLogo;
