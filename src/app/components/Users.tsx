import React, { useEffect, useState, useRef, useContext } from "react";
import { Context } from "@/app/context/Context";

interface UserProps {
  username: string;
  _id: string;
}

function Users() {
  const [userList, setUserList] = useState<UserProps[]>([]);
  const [searchedUser, setSearchedUser] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useContext(Context)!;

  const fetchUsers = async () => {
    const API_URL = process.env.API_URL || "http://localhost:3000";
    const res = await fetch(`${API_URL}/api/users`);

    if (res.ok) {
      const data = await res.json();
      setUserList(data);
    }
  };

  useEffect(() => {
    fetchUsers();

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
    <div ref={dropdownRef} className="relative">
      <input
        type="text"
        className="py-2 px-4 mb-4 bg-gray-100 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-600
        dark:bg-gray-700 dark:text-zinc-50 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
        placeholder="Search..."
        value={searchedUser}
        onChange={(e) => setSearchedUser(e.target.value)}
      />
      {searchedUser && userToShow.length > 0 && (
        <div
          className="absolute left-0 w-full z-10 mt-1 bg-white dark:bg-gray-700 border dark:border-gray-800
        dark:text-zinc-50 rounded-md shadow-lg max-h-40 overflow-y-auto shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] "
        >
          {userToShow.map((user) => (
            <div
              key={user.username}
              className="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
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
