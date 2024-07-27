"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { parseDbTime } from "~/app/_utils/dateHelpers";
import { days } from "~/server/types";
import { api } from "~/trpc/react";

const Teachers = () => {
  const { data: teachers, isLoading } = api.teacher.list.useQuery();
  const router = useRouter();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex h-full flex-col p-2">
      <div className="flex-1">
        <h3 className="text-2xl font-bold">Teachers</h3>
        <table className="w-full table-auto divide-y divide-gray-200">
          <thead className="text-left">
            <tr>
              <th>Name</th>
              <th>Instruments</th>
              <th>Working hours</th>
            </tr>
          </thead>
          <tbody>
            {teachers?.length &&
              teachers.map((teacher, index) => (
                <tr
                  key={index}
                  className="cursor-pointer hover:bg-purple-200/70"
                  onClick={() => router.push(`staff/${teacher.id}`)}
                >
                  <td>{teacher.user?.name}</td>
                  <td className="min-w-fit">
                    <div className="flex gap-2 py-2">
                      {teacher.instruments.length === 0 && "None"}
                      {teacher.instruments.some((el) =>
                        Object.values(el).some((el) => el !== null),
                      ) ? (
                        teacher.instruments.map((instrument, index) => (
                          <span
                            className="rounded-full border-2 border-purple-600 bg-purple-300 p-2"
                            key={index}
                          >
                            {instrument.name}
                          </span>
                        ))
                      ) : (
                        <p>None</p>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col items-start justify-start gap-2 py-4">
                      {teacher.workingHours?.length === 0 && "No working hours"}
                      {teacher.workingHours?.some((el) =>
                        Object.values(el).some((el) => el !== null),
                      )
                        ? teacher.workingHours
                            .sort((a, b) => {
                              return days.indexOf(a.day) - days.indexOf(b.day);
                            })
                            .map((workingHour, index) => (
                              <span key={index}>
                                {workingHour.day}:{" "}
                                {parseDbTime(workingHour.startTime)} -{" "}
                                {parseDbTime(workingHour.endTime)}
                              </span>
                            ))
                        : "No working hours"}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Teachers;
