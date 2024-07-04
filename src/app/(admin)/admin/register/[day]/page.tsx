"use client";

import type { InferSelectModel } from "drizzle-orm";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  determineDate,
  getYamahaMonthStartEnd,
} from "~/app/_utils/dateHelpers";
import type { attendance, classes, lessons, pupils } from "~/server/db/schemas";
import { zodDays } from "~/server/types";
import { api } from "~/trpc/react";

const Attendance = ({ att }: { att: InferSelectModel<typeof attendance> }) => {
  const [value, setValue] = useState(att.value ?? "");

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

  console.log("Attendance value: ", value);

  return (
    <div
      onClick={handleClick}
      className="h-full w-full cursor-pointer border-2 border-black"
    >
      {value ?? "Nothing"}
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

const Page = ({ params: { day } }: { params: { day: string } }) => {
  const { defaultStartDate, defaultEndDate } = getYamahaMonthStartEnd();
  const searchParams = useSearchParams();
  const startDate = searchParams.get("startDate") ?? defaultStartDate;
  const endDate = searchParams.get("endDate") ?? defaultEndDate;
  const { data: classes, isLoading } = api.register.getClassesForDay.useQuery({
    day: getDayNameFromInteger(parseInt(day)),
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  });

  if (isLoading || !classes) {
    return <div>Loading...</div>;
  }

  const dates = getDatesForDayOfWeek(
    parseInt(day),
    new Date(startDate),
    new Date(endDate),
  );

  return (
    <div className="flex w-full">
      <div className="w-full overflow-x-scroll">
        <table className="w-full divide-y divide-gray-100 overflow-x-scroll">
          <thead className="text-left">
            <tr>
              <th className="sticky left-0 whitespace-nowrap border-r border-gray-200 bg-purple-200 p-1 px-2">
                <p>Time</p>
              </th>
              <th className="sticky left-12 whitespace-nowrap border-r border-gray-200 bg-purple-200 p-1 px-2">
                <p>Teacher</p>
              </th>
              <th className="sticky left-32 whitespace-nowrap border-r border-gray-200 bg-purple-200 p-1 px-2">
                <p>Instrument</p>
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
            {classes.map((classe) => {
              return (
                <ClassRows classe={classe} dates={dates} key={classe.id} />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TeacherName = ({ teacherId }: { teacherId: string | null }) => {
  if (!teacherId) return <>Unknown teacher</>;
  const { data: teacher } = api.teacher.show.useQuery({ id: teacherId });
  if (!teacher) return <>Unknown teacher</>;
  return <>{teacher.user?.name}</>;
};

const InstrumentName = ({ instrumentId }: { instrumentId: string | null }) => {
  if (!instrumentId) return <>Unknown instrument</>;
  const { data: instrument } = api.instrument.show.useQuery({
    id: instrumentId,
  });
  if (!instrument) return <>Unknown instrument</>;
  return <>{instrument?.name}</>;
};

const AttendanceInput = ({
  lesson,
  pupilId,
}: {
  lesson: InferSelectModel<typeof lessons>;
  pupilId: string;
}) => {
  const { data, isLoading } = api.register.getAttendanceForLesson.useQuery({
    lessonId: lesson.id,
    pupilId,
  });

  if (isLoading) return <td>Loading...</td>;
  if (!data?.length) return <td>Unknown</td>;
  if (data.length > 1) {
    toast.error(
      `${data.length} attendance records found for this lesson. Please contact support, quoting the following: LESSON ID = ${lesson.id}. ATTENDANCE ID =  ${data[0]?.id}`,
    );
  }
  const attendance = data[0];
  if (!attendance) return null;
  return (
    <td key={attendance?.id}>
      <span className="flex gap-1">
        <Attendance att={attendance} />
      </span>
    </td>
  );
};

const ClassRows = ({
  classe,
  dates,
}: {
  classe: InferSelectModel<typeof classes>;
  dates: Date[];
}) => {
  const { data, isLoading } = api.register.getPupilsForClass.useQuery({
    classId: classe.id,
  });
  if (isLoading)
    return (
      <tr>
        <td>Loading...</td>
      </tr>
    );
  if (!data)
    return (
      <tr>
        <td>No pupils found</td>
      </tr>
    );

  return data.map((pupil) => (
    <PupilRow pupil={pupil} classe={classe} dates={dates} key={pupil.id} />
  ));
};

const PupilRow = ({
  pupil,
  classe,
  dates,
}: {
  pupil: InferSelectModel<typeof pupils>;
  classe: InferSelectModel<typeof classes>;
  dates: Date[];
}) => {
  const { data: lessons, isLoading } = api.register.getLessonsForClass.useQuery(
    {
      classId: classe.id,
      after: dates[0]!,
      before: dates[dates.length - 1]!,
    },
  );

  if (!lessons?.length) return null;

  return (
    <tr
      key={classe.id + pupil.id}
      className={`hover:bg-purple-400/30 ${pupil.isDroppedOut && "line-through"}`}
    >
      <td className="sticky left-0 whitespace-nowrap border-r border-gray-200 bg-purple-200 ">
        <p className="p-1">{classe.startTime}</p>
      </td>
      <td className="sticky left-12 whitespace-nowrap border-r border-gray-200 bg-purple-200">
        <p className="p-1 text-left">
          <TeacherName teacherId={classe.regularTeacherId} />
        </p>
      </td>
      <td className="sticky left-32 whitespace-nowrap border-r border-gray-200 bg-purple-200">
        <p className="p-1">
          <InstrumentName instrumentId={classe.instrumentId} />
        </p>
      </td>
      <td className="sticky left-48 whitespace-nowrap border-r border-gray-200 bg-purple-200">
        <ClassTypeName typeId={classe.typeId} />
      </td>
      <td className="sticky left-64 whitespace-nowrap border-r border-gray-200 bg-purple-200">
        <p className=" max-w-32 overflow-clip p-1">{pupil.fName}</p>
      </td>
      <td className="sticky left-80 whitespace-nowrap border-r border-gray-200 bg-purple-200">
        <p className="max-w-32 overflow-clip p-1">{pupil.lName}</p>
      </td>
      {dates.map((date) => {
        const lesson = lessons.find(
          (l) => new Date(l.date).getDate() === date.getDate(),
        );
        console.log("lessons: ", lessons);
        if (!lesson?.id) return null;
        return (
          <AttendanceInput
            lesson={lesson}
            pupilId={pupil.id}
            key={lesson?.id + pupil.id}
          />
        );
      })}
    </tr>
  );
};

const ClassTypeName = ({ typeId }: { typeId: string | null }) => {
  if (!typeId) return <p>Unknown type</p>;
  const { data: type } = api.classType.show.useQuery({ classTypeId: typeId });
  if (!type) return <p>Unknown type</p>;
  return <p>{type.name}</p>;
};

export default Page;
