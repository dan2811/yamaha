"use client";
import type { InferSelectModel } from "drizzle-orm";
import { findEarliestClass, findLatestClass } from "~/app/_utils/ClassHelpers";
import {
  parseDbTime,
  transformNumberToWeekDay,
} from "~/app/_utils/dateHelpers";
import type { classes, lessons } from "~/server/db/schemas";
import { generateTimeIntervals } from "./diaryHelpers";
import Link from "next/link";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

const TimetableCard = ({
  class: c,
  lesson,
  currentTime,
}: {
  class: InferSelectModel<typeof classes>;
  lesson?: InferSelectModel<typeof lessons>;
  currentTime: string;
}) => {
  if (currentTime !== parseDbTime(c.startTime)) {
    return (
      <div className="h-full w-full border-x-2 border-b-2 border-black">
        <Link href={`/admin/classes/${c.id}`} className="h-full w-full">
          <div className="h-full w-full">⌄</div>
        </Link>
      </div>
    );
  }

  if (!lesson) {
    const { data: instrument } = api.instrument.show.useQuery({
      id: c.instrumentId,
    });
    const { data: teacher } = api.teacher.show.useQuery({
      id: c.regularTeacherId,
    });
    const { data: classType } = api.classType.show.useQuery({
      classTypeId: c.typeId ?? "",
    });

    const { data } = api.classes.showClassLevel.useQuery({
      classLevelId: c.levelId ?? "",
    });

    const classLevel = data ? data[0] : undefined;

    return (
      <div
        className={`h-full w-full overflow-clip border-black ${c.lengthInMins > 30 ? "border-l-2 border-r-2 border-t-2" : "border-2"}`}
      >
        <Link href={`/admin/classes/${c.id}`} className="h-full w-full">
          <p className="h-full w-full">
            {teacher?.user?.name} {instrument?.name} - {classLevel?.name ?? ""}{" "}
            {classType?.name ?? ""}
          </p>
        </Link>
      </div>
    );
  }
  return <div></div>;
};

const Diary = ({ searchParams }: { searchParams?: { date: string } }) => {
  const router = useRouter();

  if (!searchParams?.date) {
    void router.push(`?date=${new Date().toISOString().split("T")[0]}`);
  }
  const date = new Date(searchParams?.date ?? new Date());
  const { data: rooms, isLoading: isRoomsLoading } = api.rooms.list.useQuery();
  const { data: classes, isLoading: isClassesLoading } =
    api.register.getClassesForDay.useQuery({
      day: transformNumberToWeekDay(date.getDay())!,
      endDate: date,
    });
  const { data: lessons, isLoading: isLessonsLoading } =
    api.lessons.getLessonsForDate.useQuery({ date });

  if (!classes && !lessons) {
    return <div>No classes or lessons for this day</div>;
  }

  if (isRoomsLoading || isClassesLoading || isLessonsLoading) {
    return <div>Loading...</div>;
  }

  const earliestClassOrLesson = findEarliestClass([...classes!, ...lessons!]);

  const latestClassOrlesson = findLatestClass([...classes!, ...lessons!]);

  const times = generateTimeIntervals(
    !earliestClassOrLesson ? "09:00" : earliestClassOrLesson.startTime,
    !latestClassOrlesson ? "21:00" : latestClassOrlesson.endTime,
  );

  console.log("loaded");

  return (
    <table className="w-full table-fixed border-collapse">
      <thead>
        <tr>
          <th className="w-16 max-w-12 table-auto border-2 border-black">
            Time
          </th>
          {rooms?.map((room) => (
            <th key={room.id} className="border-2 border-black">
              {room.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {times.map((currentTime) => {
          return (
            <tr key={currentTime} className={`h-10 hover:bg-purple-200`}>
              <td>{currentTime}</td>
              {rooms?.map((room) => {
                const roomClasses = classes?.filter(
                  (c) => c.roomId === room.id,
                );

                const classesHappeningNow = roomClasses?.filter((c) => {
                  const startTime = parseDbTime(c.startTime);
                  const endTime = parseDbTime(c.endTime);
                  return startTime <= currentTime && currentTime < endTime;
                });

                if (!classesHappeningNow?.length) {
                  return (
                    <td key={room.id + currentTime} className="border-2"></td>
                  );
                }

                if (classesHappeningNow.length === 1) {
                  const classAtTime = classesHappeningNow[0]!;
                  const lesson = lessons?.find(
                    (l) =>
                      l.classId === classAtTime.id &&
                      l.startTime === currentTime,
                  );

                  return (
                    <td
                      key={classAtTime.id}
                      className="h-10 bg-gray-200 text-center"
                    >
                      <TimetableCard
                        class={classAtTime}
                        lesson={lesson}
                        currentTime={currentTime}
                      />
                    </td>
                  );
                }

                if (classesHappeningNow.length > 1) {
                  const classAtTime = classesHappeningNow[0]!;
                  return (
                    <td
                      key={classAtTime.id}
                      className="h-full w-full animate-pulse bg-red-400 text-center "
                    >
                      <span className="pb-2 font-bold text-red-600">
                        CLASH!
                      </span>
                      <div className="flex w-full gap-2">
                        {classesHappeningNow.map((c) => (
                          <div key={c.id} className="w-1/2">
                            <TimetableCard
                              class={c}
                              lesson={lessons?.find((l) => l.classId === c.id)}
                              currentTime={currentTime}
                            />
                          </div>
                        ))}
                      </div>
                    </td>
                  );
                }
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Diary;
