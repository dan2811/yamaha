"use client";
import type { InferSelectModel } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { workingHours } from "~/server/db/schemas";
import { Day } from "~/server/types";
import { api } from "~/trpc/react";

interface SwitchProps {
  isOn: boolean;
  handleToggle: () => void;
  id: string;
}

const Switch: React.FC<SwitchProps> = ({ isOn, handleToggle, id }) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={isOn}
        onChange={handleToggle}
        className="hidden"
        id={id}
      />
      <label
        htmlFor={id}
        className={`flex h-6 w-12 cursor-pointer items-center rounded-full p-1 transition-colors duration-300 ${
          isOn ? "bg-purple-600" : "bg-gray-300"
        }`}
      >
        <div
          className={`h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
            isOn ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </label>
    </div>
  );
};

const WorkingHoursCard = ({
  day,
  teacherId,
  hours,
  refetch,
}: {
  day: Day;
  teacherId: string;
  hours?: InferSelectModel<typeof workingHours>;
  refetch: () => Promise<void>;
}) => {
  const [active, setActive] = useState(Boolean(hours));
  const [startTime, setStartTime] = useState(hours?.startTime ?? "16:00");
  const [endTime, setEndTime] = useState(hours?.endTime ?? "20:00");

  const handleStartTimeChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const loadingToast = toast.loading("Saving...");

    setStartTime(e.target.value);
    await updateWorkingHours(
      {
        id: hours!.id,
        startTime: e.target.value,
        endTime,
      },
      {
        onSuccess: () => {
          toast.dismiss(loadingToast);
          toast.success("Working hours updated");
        },
        onError: () => {
          toast.dismiss(loadingToast);
          toast.error("Failed to update working hours");
        },
      },
    );
  };

  const handleEndTimeChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const loadingToast = toast.loading("Saving...");
    setEndTime(e.target.value);
    await updateWorkingHours(
      {
        id: hours!.id,
        startTime,
        endTime: e.target.value,
      },
      {
        onSuccess: () => {
          toast.dismiss(loadingToast);
          toast.success("Working hours updated");
        },
        onError: () => {
          toast.dismiss(loadingToast);
          toast.error("Failed to update working hours");
        },
      },
    );
  };

  const { mutateAsync: addWorkingHours } =
    api.teacher.addWorkingHours.useMutation();

  const { mutateAsync: deleteWorkingHours } =
    api.teacher.deleteWorkingHours.useMutation();

  const { mutateAsync: updateWorkingHours } =
    api.teacher.updateWorkingHours.useMutation();

  return (
    <form className="flex h-fit w-fit flex-col gap-2 rounded border-2 border-purple-600 bg-purple-300 p-4">
      <span className="flex justify-between">
        <h2 className="text-lg">{day}</h2>
        <Switch
          id={day}
          handleToggle={async () => {
            if (active) {
              void deleteWorkingHours({
                id: hours!.id,
              });
            }
            if (!active) {
              await addWorkingHours({
                teacherId,
                day,
                startTime,
                endTime,
              });
            }
            setActive((prev) => !prev);
            await refetch();
          }}
          isOn={active}
        />
      </span>
      <fieldset className="flex items-center justify-between font-light">
        <label className="pr-2">Start Time</label>
        <input
          type="time"
          value={startTime}
          onChange={handleStartTimeChange}
          className="rounded p-2"
          disabled={!active}
        />
      </fieldset>
      <fieldset className="flex items-center justify-between font-light">
        <label className="pr-2">End Time</label>
        <input
          type="time"
          value={endTime}
          onChange={handleEndTimeChange}
          className="rounded p-2"
          disabled={!active}
        />
      </fieldset>
    </form>
  );
};

export default WorkingHoursCard;
