"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { parseDbTime } from "~/app/_utils/dateHelpers";
import { api } from "~/trpc/react";

const NewClassList = () => {
  const { data } = api.classes.listNewClasses.useQuery();
  const router = useRouter();
  return (
    <div className="h-full w-full">
      <table className="w-full table-auto">
        <thead className="border-b-2 border-purple-500/40 text-left">
          <tr>
            <th className="p-2">Instrument</th>
            <th className="border-x-2 border-purple-500/40 p-2">Day</th>
            <th className="border-x-2 border-purple-500/40 p-2">Time</th>
            <th className="border-x-2 border-purple-500/40 p-2">Teacher</th>
            <th className="p-2">Capacity</th>
          </tr>
        </thead>
        <tbody>
          {data?.map(
            ({
              id,
              day,
              instrumentId,
              regularTeacherId,
              startTime,
              maxPupils,
              pupilsCount,
            }) => {
              return (
                <tr
                  title={"test"}
                  key={id}
                  className="cursor-pointer border-b-2 border-purple-500/20 hover:bg-purple-500/40"
                  onClick={() => router.push(`/admin/newClasses/${id}`)}
                >
                  <Instrument
                    className="flex items-center justify-center"
                    id={instrumentId}
                  />
                  <td>{day}</td>
                  <td className="line-clamp-2 max-w-sm overflow-auto">
                    {parseDbTime(startTime)}
                  </td>
                  <Teacher id={regularTeacherId} />
                  <td className="max-w-xs overflow-auto">{`${pupilsCount}/${maxPupils}`}</td>
                </tr>
              );
            },
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NewClassList;

const Instrument = ({
  id,
  className,
}: {
  id: string | null;
  className: string;
}) => {
  const {
    data: instrument,
    isLoading,
    isError,
  } = api.instrument.show.useQuery({ id });
  if (isLoading) return <td className={className}>Loading...</td>;

  if (isError) return <td className={className + "text-red-600"}>Error</td>;
  return <td className={className}>{instrument?.name}</td>;
};

const Teacher = ({
  id,
  className,
}: {
  id: string | null;
  className?: string;
}) => {
  const { data, isLoading, isError } = api.teacher.show.useQuery({ id });
  if (isLoading) return <td className={className}>Loading...</td>;
  if (isError) return <td className={className + "text-red-600"}>Error</td>;
  return <td className={className}>{data?.user?.name}</td>;
};
