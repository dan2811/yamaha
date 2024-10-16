"use client";
import AdminButton from "~/app/_components/admin/Button";
import BackButton from "../../../tasters/@show/_backButton";
import React from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

import { InfoCard } from "~/app/_components/admin/InfoCard";
import LoadingSpinner from "~/app/_components/admin/LoadingSpinner";

const ShowRoom = ({  params: { id }  }: { params: { id: string } }) => {
    const { data, isLoading, isError, error } = api.rooms.show.useQuery({ id });
    const router = useRouter();

  
    if (isLoading) {
      return <div>Loading...</div>;
    }
    if (isError) return <div>{error.message}</div>;
    if (!data) return <div>Could not find the room.</div>
    return (
        <div className="h-full w-full p-2">
          <span className="flex justify-between">
            <h3 className="text-xl font-bold">{data.name}</h3>
            <span className="flex gap-2">
              <AdminButton>
                <Link href="/admin/settings/rooms/update">✏️ Edit</Link>
              </AdminButton>
          
              <BackButton
                returnPath="/admin/settings/rooms"
                label="⬅️ Back to list"
              />
            </span>
          </span>
          <article className="grid grid-cols-1 gap-6 p-2 sm:grid-cols-2">
            <InfoCard 
              title="Room Information"
              info={{ Description: data.description }}
            >
            </InfoCard>  
          </article>
        </div>
    )  
}

export default ShowRoom;