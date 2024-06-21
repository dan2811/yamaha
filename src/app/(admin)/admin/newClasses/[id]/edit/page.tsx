"use client";
import React from "react";
import { api } from "~/trpc/react";
import { InfoCard } from "~/app/_components/admin/InfoCard";
import { parseDbTime } from "~/app/_utils/dateHelpers";
import BackButton from "../../../tasters/@show/_backButton";

const ShowNewClass = ({ params: { id } }: { params: { id: string } }) => {
  const { data, isLoading, isError, error } =
    api.classes.showNewClasses.useQuery({
      id,
    });
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error.message}</p>;

  return (
    <div className="h-full w-full p-2">
      <span className="flex justify-between">
        <h3 className="text-xl font-bold">New Class</h3>
        <span className="flex gap-2">
          <BackButton
            returnPath="/admin/newClasses/list"
            label="⬅️ Back to list"
          />
        </span>
      </span>
      <article className="grid grid-cols-1 gap-6 p-2 sm:grid-cols-2">
        <InfoCard
          title="Lesson"
          info={{
            "Start Date": data?.classes.startDate
              ? new Date(data?.classes.startDate).toLocaleDateString()
              : "",
            Time: data?.classes.startTime
              ? parseDbTime(data?.classes.startTime)
              : "Unknown",
            Teacher: data?.user?.name,
            Instrument: data?.instrument?.name,
          }}
        />
      </article>
    </div>
  );
};

export default ShowNewClass;
