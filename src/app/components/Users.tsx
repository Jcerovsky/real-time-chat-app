import React, { useEffect, useState, useRef, useContext } from "react";
import { Context } from "@/app/context/Context";
import { UserProps } from "@/app/interfaces/interfaces";

interface I {
  userList: UserProps[];
  handleSelectUser: (user: UserProps) => void;
}

function Users({ userList, handleSelectUser }: I) {
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

  return (
    <div ref={dropdownRef} className="relative max-sm:flex">
      <input
        type="text"
        className="py-2 px-4 mb-4 bg-gray-100 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-600
        dark:bg-gray-700 dark:text-zinc-50 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] w-full"
        placeholder="Search..."
        value={searchedUser}
        onChange={(e) => setSearchedUser(e.target.value)}
      />
      {searchedUser && userToShow.length > 0 && (
        <div
          className="absolute left-0 w-full z-10 mt-12 sm:mt-0 bg-white dark:bg-gray-700 border dark:border-gray-800
        dark:text-zinc-50 rounded-md shadow-lg max-h-40 overflow-y-auto shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] "
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
    </div>
  );
}

export default Users;
