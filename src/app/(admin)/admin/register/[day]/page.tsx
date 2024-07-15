"use client";

import type { InferSelectModel } from "drizzle-orm";
import { useSearchParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  determineDate,
  getDatesForDayOfWeek,
  getYamahaMonthStartEnd,
  parseDbTime,
} from "~/app/_utils/dateHelpers";
import type { attendance, classes, lessons, pupils } from "~/server/db/schemas";
import { AttendanceValues, attendanceValues, zodDays } from "~/server/types";
import { api } from "~/trpc/react";

const Attendance = ({
  pupilId,
  classId,
  date,
}: {
  pupilId: string;
  classId: string;
  date: Date;
}) => {
  console.log(date.toISOString(), date.toLocaleDateString());
  const {
    data: attendance,
    isLoading: isLoadingAttendance,
    fetchStatus,
  } = api.register.getAttendanceForLesson.useQuery({
    classId,
    date,
    pupilId,
  });

  const { mutateAsync, isPending } = api.register.markAttendance.useMutation();

  const options = {
    Attended: "A",
    "Did not attend": "DNA",
    Cancelled: "C",
    "Late cancelled": "LC",
    "We cancelled": "WC",
    Moved: "M",
    Reset: "➕",
  } as const;

  const [selectedOption, setSelectedOption] =
    useState<keyof typeof options>("Reset");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("useEffect", fetchStatus);
    setSelectedOption(attendance?.value ?? "Reset");
  }, [fetchStatus]);

  const handleSelectChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const prevSelectedOption = selectedOption;
    if (event.target.value in options) {
      setSelectedOption(event.target.value as keyof typeof options);

      const value: AttendanceValues | null =
        event.target.value === "Reset"
          ? null
          : (event.target.value as AttendanceValues);

      await mutateAsync(
        {
          classId,
          pupilId,
          date,
          value,
        },
        {
          onError: (e) => {
            toast.error(e.message);
            setSelectedOption(prevSelectedOption);
          },
          onSuccess: () => {
            toast.success("Attendance updated");
          },
        },
      );
    } else {
      toast.error("Invalid attendance option");
    }
  };

  console.log(
    `${pupilId} SHOULD BE SHORT VALUE FOR ${selectedOption} / ${attendance?.value} - ${date.toISOString()}`,
    options[selectedOption],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false); // Set dropdown to closed if click is outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoadingAttendance || isPending) return <td>Loading...</td>;

  return (
    <td key={classId + pupilId} className="border-l-2">
      <span className="flex min-w-52 gap-1">
        <div
          onBlur={() => setIsDropdownOpen(false)}
          ref={containerRef}
          className="min-w-fit"
        >
          <div
            className={`cursor-pointer border-r-2 p-2 ${isDropdownOpen && "hidden"}`}
            onClick={() => {
              setIsDropdownOpen(true);
            }}
          >
            {options[selectedOption]}
          </div>
          <select
            value={selectedOption}
            onChange={handleSelectChange}
            onSelect={() => setIsDropdownOpen(true)}
            className={`h-full w-full cursor-pointer ${!isDropdownOpen && "hidden"}`}
          >
            <option disabled></option>
            {Object.entries(options).map(([full]) => (
              <option key={full} value={full}>
                {full}
              </option>
            ))}
          </select>
        </div>
        <textarea
          className="h-fit w-full text-sm"
          defaultValue="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Qui
    quibusdam dolorem veniam ducimus quo, voluptate ex nemo veritatis at
    repellat cupiditate? Pariatur optio modi placeat, aliquid facere
    blanditiis maxime quaerat?"
        />
      </span>
    </td>
  );
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
  return (
    <tr
      key={pupil.id + classe.id}
      className={`h-fit hover:bg-purple-400/30 ${pupil.isDroppedOut && "line-through"}`}
    >
      <td className="sticky left-0 whitespace-nowrap border-r border-gray-200 bg-purple-200 ">
        <p className="p-1">{parseDbTime(classe.startTime)}</p>
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
        return (
          <Attendance
            date={date}
            classId={classe.id}
            pupilId={pupil.id}
            key={pupil.id + date.toISOString()}
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
