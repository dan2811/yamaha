import React, { type Dispatch, useState } from "react";
import toast from "react-hot-toast";
import AdminButton from "~/app/_components/admin/Button";
import type { workingHours } from "~/server/db/schemas";
import { type Day, days } from "~/server/types";
import { api } from "~/trpc/react";

const EditWorkingHoursModal = ({
  teacherId,
  onComplete,
  day,
  setIsOpen,
  refetch,
  allWorkingHours,
}: {
  teacherId: string;
  onComplete: () => void;
  setIsOpen: Dispatch<React.SetStateAction<Day | undefined>>;
  day: Day | undefined;
  refetch: () => void;
  allWorkingHours: (typeof workingHours.$inferSelect)[];
}) => {
  const { mutateAsync, isPending, reset } =
    api.teacher.addWorkingHours.useMutation();

  const [startTime, setStartTime] = useState<string>();
  const [endTime, setEndTime] = useState<string>();

  const thisDaysWorkingHours = allWorkingHours.filter(
    (hourObj) => hourObj.dayOfWeek === days.indexOf(day!),
  );

  return day !== undefined ? (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="z-10 flex min-w-64 flex-col rounded bg-white p-4 shadow-lg">
          <span
            className="cursor-pointer place-self-end"
            onClick={() => setIsOpen(undefined)}
          >
            Close ❌
          </span>
          <form
            className="flex flex-col gap-6 p-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!startTime || !endTime)
                return toast.error(
                  "Please choose a start time and an end time",
                );
              const start = new Date(`1970-01-01T${startTime}Z`);
              const end = new Date(`1970-01-01T${endTime}Z`);
              if (start >= end) {
                return toast.error("Start time must be before end time");
              }
              await mutateAsync(
                {
                  teacherId,
                  dayOfWeek: days.indexOf(day),
                  startTime,
                  endTime,
                },
                {
                  onError: (error) => {
                    console.log(error);
                    toast.error(error.message);
                    reset();
                  },
                  onSuccess: () => {
                    toast.success("Hours added successfully");
                    void refetch();
                    onComplete();
                    setIsOpen(undefined);
                  },
                },
              );
            }}
          >
            <label>{day}:</label>
            {thisDaysWorkingHours.map((hourObj, index) => (
              <span key={index}>
                {hourObj.startTime} - {hourObj.endTime}
              </span>
            ))}
            <label>Start time:</label>
            <input
              type="time"
              onChange={(e) => setStartTime(e.target.value)}
              step="300"
            />

            <label>End time:</label>
            <input
              type="time"
              onChange={(e) => setEndTime(e.target.value)}
              step="300"
            />
            <AdminButton disabled={isPending} type="submit" value="Submit">
              Add
            </AdminButton>
          </form>
        </div>
      </div>
    </div>
  ) : null;
};

export default EditWorkingHoursModal;
