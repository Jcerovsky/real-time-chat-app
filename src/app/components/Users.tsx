"use client";

import React, { useState } from "react";

interface UserProps {
  username: string;
  _id: string;
}

function Users() {
  const [userList, setUserList] = useState<UserProps[]>([]);

  const fetchUsers = async () => {
    const API_URL = process.env.API_URL || "http://localhost:3000";
    const res = await fetch(`${API_URL}/api/users`);

    if (res.ok) {
      console.log("success");
      const data = await res.json();
      setUserList(data);
    }
  };

  return (
    <div>
      <div>
        <ul>
          {userList.map((user) => (
            <li>
              {user.username} - {user._id}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={fetchUsers}>GET USERS</button>
    </div>
  );
}

export default Users;
