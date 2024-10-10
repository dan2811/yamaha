"use client";
import AdminButton from "~/app/_components/admin/Button";
import BackButton from "../../../tasters/@show/_backButton";
import React from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

const ShowRoom = ({  params: { id }  }: { params: { id: string } }) => {
    const { data, isLoading, isError, error } = api.rooms.show.useQuery({ id });
    const router = useRouter();
  
    if (isLoading) {
      return <div>Loading...</div>;
    }
    if (isError) return <p>{error.message}</p>;
    return (
        <div className="h-full w-full p-2">
          <span className="flex justify-between">
            <h3 className="text-xl font-bold">{data.name}</h3>
            <span className="flex gap-2">
              <AdminButton>
                <Link href="/admin/settings/rooms/update">✏️ Edit</Link>
              </AdminButton>
          
              <BackButton
                returnPath="/admin/newClasses/list"
                label="⬅️ Back to list"
              />
            </span>
          </span>
            <div>
                <p>{data.description}</p>
            </div>
           
        </div>
    )  
}

export default ShowRoom;