"use client";
import { useRouter } from "next/navigation";
import AdminButton from "~/app/_components/admin/Button";
import React from "react";
import Link from "next/link";
import { api } from "~/trpc/react";

const Rooms = () => {
  const router = useRouter();
  return (
    <div className="flex h-full flex-col p-2">
      <div className="flex-1">
        <h3 className="text-2xl font-bold">Rooms</h3>
        <AdminButton>
        <Link href="/admin/settings/rooms/create">Add a room</Link>
      </AdminButton>
      </div>
    </div>
  );
};

export default Rooms;