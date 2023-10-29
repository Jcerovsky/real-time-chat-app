import React, { useEffect, useState, useRef, useContext } from "react";
import { Context } from "@/app/context/Context";
import { MessageProps, UserProps } from "@/app/interfaces/interfaces";
import UserLogo from "@/app/components/UserLogo";

interface I {
  userList: UserProps[];
  handleSelectUser: (user: UserProps) => void;
  recentChats: MessageProps[];
}

function Users({ userList, handleSelectUser, recentChats }: I) {
  const [searchedUser, setSearchedUser] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useContext(Context)!;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSearchedUser("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const userToShow = userList.filter(
    (user) =>
      user.username.toLowerCase().includes(searchedUser.toLowerCase()) &&
      user.username !== currentUser,
  );

  const selectUser = (value: string) => {
    const selectedUser = userList.find(
      (user) => user.username.toLowerCase() === value,
    );
    if (selectedUser !== undefined) {
      handleSelectUser(selectedUser);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <input
        type="text"
        className="py-2 px-4 mb-4 bg-gray-100 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-600
        dark:bg-gray-700 dark:text-zinc-50 shadow w-full"
        placeholder="Search..."
        value={searchedUser}
        onChange={(e) => setSearchedUser(e.target.value)}
      />
      {searchedUser && userToShow.length > 0 && (
        <div
          className="absolute left-0 w-full z-10 mt-12 sm:mt-0 bg-white dark:bg-gray-700 border dark:border-gray-800
        dark:text-zinc-50 rounded-md shadow-lg max-h-40 overflow-y-auto shadow "
        >
          {userToShow.map((user, i) => (
            <div
              key={user.username}
              onClick={() => handleSelectUser(user)}
              className={`
                p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 ${
                  i !== 0 && "border-t"
                } dark:border-gray-600 text-sm
              `}
            >
              {user.username}
            </div>
          ))}
        </div>
      )}
      <div>
        {recentChats.map((chat) => (
          <div
            key={chat.to}
            className="flex mb-2 items-center gap-2 dark:text-zinc-50"
          >
            <UserLogo user={chat.to} />
            <div
              className="flex flex-col text-sm cursor-pointer w-3/4"
              onClick={() => selectUser(chat.to)}
            >
              <p>{chat.to}</p>
              <p className="truncate opacity-50">{chat.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Users;
