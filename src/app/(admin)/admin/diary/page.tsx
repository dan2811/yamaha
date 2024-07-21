import type { InferSelectModel } from "drizzle-orm";
import { getClassClashes } from "~/app/_utils/ClassClashes";
import { findEarliestClass, findLatestClass } from "~/app/_utils/ClassHelpers";
import {
  parseDbTime,
  transformNumberToWeekDay,
} from "~/app/_utils/dateHelpers";
import type { classes, lessons } from "~/server/db/schemas";
import { api } from "~/trpc/server";

const TimetableCard = async ({
  class: c,
  lesson,
}: {
  class: InferSelectModel<typeof classes>;
  lesson?: InferSelectModel<typeof lessons>;
}) => {
  if (!lesson) {
    const instrument = await api.instrument.show({ id: c.instrumentId });
    const teacher = await api.teacher.show({ id: c.regularTeacherId });
    let classType;
    if (c.typeId) {
      classType = await api.classType.show({ classTypeId: c.typeId });
    }
    let classLevel;
    if (c.levelId) {
      [classLevel] = await api.classes.showClassLevel({
        classLevelId: c.levelId,
      });
    }
    return (
      <div className="overflow-clip">
        <p>
          {teacher.user?.name} {instrument?.name}
        </p>
        <p>
          {classLevel?.name ?? ""} {classType?.name ?? ""}
        </p>
      </div>
    );
  }
  return <div></div>;
};

const generateTimeIntervals = (
  startTime: string,
  endTime: string,
): string[] => {
  console.log(
    `generating times for diary starting with ${startTime} and ending with ${endTime}`,
  );
  const times: string[] = [];

  const [startHour, startMinute] = startTime
    .split(":")
    .map((str) => parseInt(str, 10));
  const [endHour, endMinute] = endTime
    .split(":")
    .map((str) => parseInt(str, 10));

  if (
    typeof startHour !== "number" ||
    typeof startMinute !== "number" ||
    typeof endHour !== "number" ||
    typeof endMinute !== "number"
  ) {
    throw new Error("Invalid time format");
  }

  for (
    let currentHour = startHour - 1, currentMinute = startMinute;
    currentHour <= (endHour ?? 23) ||
    (currentHour === endHour && currentMinute < (endMinute ?? 0));
    currentHour++
  ) {
    console.log("Generated: ", currentHour, currentMinute);
    const date = new Date(new Date().setHours(currentHour, currentMinute));
    times.push(
      date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    );
    date.setMinutes(date.getMinutes() + 30);
    times.push(
      date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    );
  }

  return times;
};

const Diary = async ({ searchParams }: { searchParams?: { date: string } }) => {
  const date = new Date(searchParams?.date ?? new Date());
  const rooms = await api.rooms.list();
  const classes = await api.register.getClassesForDay({
    day: transformNumberToWeekDay(date.getDay())!,
    endDate: date,
  });
  const lessons = await api.lessons.getLessonsForDate({ date });

  if (!classes && !lessons) {
    return <div>No classes or lessons for this day</div>;
  }

  const earliestClassOrLesson = findEarliestClass([...classes, ...lessons]);

  const latestClassOrlesson = findLatestClass([...classes, ...lessons]);

  const times = generateTimeIntervals(
    !earliestClassOrLesson ? "09:00" : earliestClassOrLesson.startTime,
    !latestClassOrlesson ? "21:00" : latestClassOrlesson.endTime,
  );

  return (
    <table className="w-full table-fixed border-collapse">
      <thead>
        <tr>
          <th className="w-16 max-w-12 table-auto border-2 border-black">
            Time
          </th>
          {rooms.map((room) => (
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
              {rooms.map((room) => {
                const roomClasses = classes.filter((c) => c.roomId === room.id);

                const classesHappeningNow = roomClasses.filter((c) => {
                  const startTime = parseDbTime(c.startTime);
                  const endTime = parseDbTime(c.endTime);
                  return startTime <= currentTime && currentTime < endTime;
                });

                if (!classesHappeningNow.length) {
                  return (
                    <td key={room.id + currentTime} className="border-2"></td>
                  );
                }

                if (classesHappeningNow.length === 1) {
                  const classAtTime = classesHappeningNow[0]!;
                  const lesson = lessons.find(
                    (l) =>
                      l.classId === classAtTime.id &&
                      l.startTime === currentTime,
                  );

                  return (
                    <td
                      key={classAtTime.id}
                      className="border-2 border-black bg-gray-200 text-center"
                    >
                      <TimetableCard class={classAtTime} lesson={lesson} />
                    </td>
                  );
                }

                if (classesHappeningNow.length > 1) {
                  const classAtTime = classesHappeningNow[0]!;
                  return (
                    <td
                      key={classAtTime.id}
                      className="h-full w-full border-2 border-black bg-red-200 text-center"
                    >
                      <span className="pb-2 font-bold text-red-600">
                        CLASH!
                      </span>
                      <div className="flex w-full gap-2">
                        {classesHappeningNow.map((c) => (
                          <div key={c.id} className="w-1/2">
                            <TimetableCard
                              class={c}
                              lesson={lessons.find((l) => l.classId === c.id)}
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
