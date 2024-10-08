"use client";
import React, { useEffect, useRef, useState } from "react";
import EditUser from "./_editUser";
import type { InferSelectModel } from "drizzle-orm";
import type { users } from "~/server/db/schemas";

// temporary types
type User = Partial<
  InferSelectModel<typeof users> & {
    lessons: {
      instrument: string;
      teacher: string;
      day: string;
      time: string;
    }[];
  }
>;

const Users = () => {
  const [users] = useState<User[]>([
    {
      name: "John Doe",
      email: "john@example.com",
      phone1: "123-456-7890",
      role: "admin",
      lessons: [
        {
          instrument: "instrument-id-1",
          teacher: "teacher-id-1",
          day: "Monday",
          time: "16:00",
        },
      ],
    },
    {
      name: "Jane Doe",
      email: "jane@doe.com",
      phone1: "123-456-7890",
      role: "client",
      lessons: [
        {
          instrument: "instrument-id-2",
          teacher: "teacher-id-2",
          day: "Tuesday",
          time: "16:30",
        },
      ],
    },
    // Add more users here
  ]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const editUserRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        editUserRef.current &&
        !editUserRef.current.contains(event.target)
      ) {
        // Check if the event target is a row in the table
        if (
          "closest" in event.target &&
          typeof event.target.closest === "function"
        ) {
          if (event.target.closest("tr")) {
            return;
          }
        }
        setSelectedUser(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRowClick = (event: React.MouseEvent, user: User) => {
    event.stopPropagation();
    setSelectedUser(user);
  };

  return (
    <div className="flex h-full">
      <div className="flex-1">
        <h3 className="text-2xl font-bold">Users</h3>
        <table className="w-full table-auto divide-y divide-gray-200">
          <thead className="text-left">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Lessons</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={index}
                onClick={(e) => handleRowClick(e, user)}
                className={
                  selectedUser === user
                    ? "bg-purple-500/80"
                    : "" + "cursor-pointer hover:bg-purple-500/40 "
                }
              >
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone1}</td>
                <td>{user.role?.toUpperCase()}</td>
                <td>{JSON.stringify(user.lessons)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedUser && (
        <div ref={editUserRef}>
          {/* <EditUser user={selectedUser} setSelectedUser={setSelectedUser} /> */}
        </div>
      )}
    </div>
  );
};

export default Users;
