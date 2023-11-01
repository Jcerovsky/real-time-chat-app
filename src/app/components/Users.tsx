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
      <div className="relative">
        <input
          type="text"
          className="py-2 px-4 mb-4 bg-gray-100 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-600
        dark:bg-gray-700 dark:text-zinc-50 shadow w-full text-xs sm:text-md hover:bg-gray-200 dark:hover:bg-gray-600
        duration-300 truncate"
          placeholder="Search..."
          value={searchedUser}
          onChange={(e) => setSearchedUser(e.target.value)}
        />
        <img
          src="/assets/chat.png"
          alt="users-chat-img"
          className="absolute right-2 top-1 w-6"
        />
      </div>
      {searchedUser && userToShow.length > 0 && (
        <div
          className="absolute left-0 w-full z-10 -mt-3 bg-white dark:bg-gray-700 border dark:border-gray-800
        dark:text-zinc-50 rounded-md shadow-lg max-h-40 overflow-y-auto shadow  "
        >
          {userToShow.map((user, i) => (
            <div
              key={user.username}
              onClick={() => {
                handleSelectUser(user);
                setSearchedUser("");
              }}
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
        {recentChats.map((chat, i) => (
          <div
            key={`${chat.to}-${i}-${chat.sender}`}
            className="flex mb-2 p-1 rounded-r-xl items-center gap-2 dark:text-zinc-50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600
             duration-300 "
            onClick={() =>
              selectUser(currentUser === chat.sender ? chat.to : chat.sender)
            }
          >
            <UserLogo
              user={currentUser === chat.sender ? chat.to : chat.sender}
            />
            <div className="flex flex-col text-sm  w-3/4">
              <p>{currentUser === chat.sender ? chat.to : chat.sender}</p>
              <p className="truncate opacity-50">{chat.content}</p>
            </div>
            {chat.sender !== currentUser && (
              <div className="w-4 h-4 bg-white rounded-full self-center" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Users;
