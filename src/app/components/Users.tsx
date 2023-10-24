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
    <div>
      <div ref={dropdownRef}>
        <input
          type="text"
          placeholder="Search for a user..."
          value={searchedUser}
          onChange={(e) => setSearchedUser(e.target.value)}
        />
        {searchedUser && userToShow.length > 0 && (
          <div className="border border-black max-h-[40] overflow-y-auto">
            {userToShow.map((user) => (
              <div key={user.username} className="p-3 cursor-pointer">
                {user.username}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;
