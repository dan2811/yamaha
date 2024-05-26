"use client";

import React, { useState } from "react";
import { determineDate } from "~/app/_utils/dateHelpers";
import { zodDays } from "~/server/types";
import { api } from "~/trpc/react";

const Attendance = () => {
  const [value, setValue] = useState("");

  const handleClick = () => {
    switch (value) {
      case "":
        setValue("Attended");
        break;
      case "Attended":
        setValue("DNA");
        break;
      case "DNA":
        setValue("C");
        break;
      case "C":
        setValue("LC");
        break;
      case "LC":
        setValue("");
        break;
      default:
        setValue("");
    }
  };

  return (
    <div onClick={handleClick} style={{ cursor: "pointer" }}>
      {value}
    </div>
  );
};

const getDatesForDayOfWeek = (
  dayNumber: number,
  startDate: Date,
  endDate: Date,
) => {
  const dates = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    if (currentDate.getDay() === dayNumber) {
      dates.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

const getDayNameFromInteger = (day: number) => {
  const date = new Date();
  date.setDate(date.getDate() - date.getDay() + day);
  return zodDays.parse(date.toLocaleDateString("en-US", { weekday: "long" }));
};

const Register = ({
  params: { day },
  startDate,
  endDate,
}: {
  params: { day: string };
  startDate: Date;
  endDate: Date;
}) => {
  const { data: classes, isLoading } = api.register.getClassesForDay.useQuery({
    day: getDayNameFromInteger(parseInt(day)),
    startDate: startDate,
    endDate: endDate,
  });

  if (isLoading || !classes) {
    return <div>Loading...</div>;
  }

classes.map((c) => c.)

  const dates = getDatesForDayOfWeek(parseInt(day), startDate, endDate);

  return (
    <div className="flex w-full">
      <div className="w-full overflow-x-scroll">
        <table className="w-full divide-y divide-gray-100 overflow-x-scroll">
          <thead>
            <tr>
              <th className="sticky left-0 whitespace-nowrap border-r border-gray-200 bg-purple-200 p-1 px-2">
                <p>Time</p>
              </th>
              <th className="sticky left-12 whitespace-nowrap border-r border-gray-200 bg-purple-200 p-1 px-2">
                <p>Teacher</p>
              </th>
              <th className="sticky left-32 whitespace-nowrap border-r border-gray-200 bg-purple-200 p-1 px-2">
                <p>Lesson</p>
              </th>
              <th className="sticky left-48 whitespace-nowrap border-r border-gray-200 bg-purple-200 p-1 px-2">
                <p>Lesson Type</p>
              </th>
              <th className="sticky left-64 whitespace-nowrap border-r border-gray-200 bg-purple-200 p-1 px-2">
                <p>First Name</p>
              </th>
              <th className="sticky left-80 whitespace-nowrap border-r border-gray-200 bg-purple-200 p-1 px-2">
                <p>Last Name</p>
              </th>
              {dates.map((date) => (
                <th
                  key={date.toISOString()}
                  className={`whitespace-nowrap border-r border-gray-200 p-1 px-2 ${determineDate(date) === "today" && "bg-purple-600/20"} ${determineDate(date) === "past" && "bg-gray-700/20"}`}
                >
                  {date.toLocaleDateString()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {classes.map(
              ({
                id,
                instrument,
                regularTeacher,
                startTime,
                type,
                pupils,
                lessons,
              }) =>
                pupils.map(({ pupil }) => (
                  <tr
                    key={id + pupil.id}
                    className={`hover:bg-purple-400/30 ${pupil.isDroppedOut && "line-through"}`}
                  >
                    <td className="sticky left-0 whitespace-nowrap border-r border-gray-200 bg-purple-200 ">
                      <p className="p-1">{startTime}</p>
                    </td>
                    <td className="sticky left-12 whitespace-nowrap border-r border-gray-200 bg-purple-200">
                      <p className="p-1 text-left">
                        {regularTeacher?.user.name}
                      </p>
                    </td>
                    <td className="sticky left-32 whitespace-nowrap border-r border-gray-200 bg-purple-200">
                      <p className="p-1">{instrument?.name}</p>
                    </td>
                    <td className="sticky left-48 whitespace-nowrap border-r border-gray-200 bg-purple-200">
                      <p className="p-1">{type?.name ?? "Unknown"}</p>
                    </td>
                    <td className="sticky left-64 whitespace-nowrap border-r border-gray-200 bg-purple-200">
                      <p className=" max-w-32 overflow-clip p-1">
                        {pupil.fName}
                      </p>
                    </td>
                    <td className="sticky left-80 whitespace-nowrap border-r border-gray-200 bg-purple-200">
                      <p className="max-w-32 overflow-clip p-1">
                        {pupil.lName}
                      </p>
                    </td>
                    {dates.map((date) => {
                      const lesson = lessons.find(
                        (l) => new Date(l.date).getDate() === date.getDate(),
                      );
                      const attendance = lesson?.attendance.find(
                        ({ pupilId }) => pupilId === pupil.id,
                      );
                      return (
                        <td key={attendance?.id}>
                          <span className="flex gap-1">
                            <Attendance />
                            <p className="line-clamp-1 overflow-ellipsis">
                              {attendance?.value}
                            </p>
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                )),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Register;
