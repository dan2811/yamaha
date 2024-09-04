"use client";
import { useRouter } from "next/navigation";
import AdminButton from "~/app/_components/admin/Button";
import React from "react";
import Link from "next/link";
import { api } from "~/trpc/react";

const Rooms = () => {
  const { data: rooms, isLoading } = api.rooms.list.useQuery();
  const router = useRouter();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="flex h-full flex-col p-2">
      <div className="flex-1">
        <h3 className="text-2xl font-bold">Rooms</h3>
        <AdminButton>
          <Link href="/admin/settings/rooms/create">Add a room</Link>
        </AdminButton>
      </div>
      <div>
        <table className="w-full table-auto divide-y divide-gray-200">
          <thead className="text-left">
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {rooms?.map(({id, name, description}) => {
              return (
                <tr
                  title={"roomsList"}
                  key={id}
                  className="cursor-pointer border-b-2 border-purple-500/20 hover:bg-purple-500/40"
                >
                  <td>{name}</td>
                  <td>{description}</td>
                </tr>
              );
            },
            )}
          </tbody>
        </table>
      </div>  
    </div>
  );
};

export default Rooms;