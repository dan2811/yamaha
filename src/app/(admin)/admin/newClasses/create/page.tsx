"use client";
import React, { type ChangeEventHandler, useState } from "react";
import toast from "react-hot-toast";
import AdminButton from "~/app/_components/admin/Button";
import LoadingSpinner from "~/app/_components/admin/LoadingSpinner";
import { SelectTeacher } from "~/app/_components/admin/SelectTeacher";
import { type Day, days } from "~/server/types";
import { api } from "~/trpc/react";

interface FormData {
  startTime: string;
  lengthInMins: string;
  day: Day;
  isStarted: boolean;
  maxPupils: number;
  startDate: string;
  instrumentId: string;
  levelId: string;
  regularTeacherId: string;
}

const CreateNewClass = () => {
  const { data: instruments, status: instrumentsQueryStatus } =
    api.instrument.list.useQuery();
  const { mutateAsync } = api.classes.createNewClass.useMutation();

  const [isStartDateUnknown, setIsStartDateUnknown] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    startTime: "16:00",
    lengthInMins: "60",
    day: days[0],
    isStarted: false,
    maxPupils: 8,
    startDate: "",
    instrumentId: instruments ? instruments[0]!.id : "",
    levelId: "",
    regularTeacherId: "",
  });

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, errorMessages } = validateFormData(
      formData,
      isStartDateUnknown,
    );

    if (!isValid) {
      toast.error(`Invalid form data \n${errorMessages.join(" \n")}`);
      return;
    }

    await mutateAsync(
      {
        ...formData,
        lengthInMins: (parseInt(formData.lengthInMins) * 10).toString(),
      },
      {
        onError: (error) => {
          toast.error("Failed to create new class");
          console.error(error);
        },
      },
    );
  };

  return (
    <div className="flex h-full w-full flex-col items-center gap-4">
      <h1 className="text-3xl">Create New Class</h1>
      <form
        onSubmit={handleSubmit}
        className="grid max-w-lg grid-cols-2 gap-6 rounded-xl bg-purple-300 p-6 text-lg"
      >
        <label>Day:</label>
        <select
          name="day"
          value={formData.day}
          onChange={handleChange}
          className="p-2"
        >
          {/* Assuming days is an array of day names */}
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
        <label>Start Time:</label>
        <input
          className="p-2"
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          step="1800"
        />
        <label>Length in Minutes:</label>
        <input
          className="p-2"
          type="number"
          name="lengthInMins"
          value={formData.lengthInMins}
          onChange={handleChange}
          step={5}
        />
        <label>Max Pupils:</label>
        <input
          className="p-2"
          type="number"
          name="maxPupils"
          value={formData.maxPupils}
          onChange={handleChange}
          min={2}
        />
        {formData.maxPupils > 8 && (
          <div className="col-span-2 bg-red-500 p-2">
            Warning: Ensure the classroom has capacity for this number of
            pupils!
          </div>
        )}
        <label>Start Date:</label>
        <div className="flex flex-col gap-1">
          <input
            className="p-2"
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            disabled={isStartDateUnknown}
            hidden={isStartDateUnknown}
          />
          <label className="flex gap-2">
            Unknown start date
            <input
              className="p-2"
              type="checkbox"
              name="isStartDateUnknown"
              onChange={() => setIsStartDateUnknown((prev) => !prev)}
            />
          </label>
        </div>
        <label>Instrument:</label>
        {instrumentsQueryStatus === "pending" ? (
          <LoadingSpinner />
        ) : instrumentsQueryStatus === "error" ? (
          <p>⛔️ Error loading instruments</p>
        ) : (
          <select
            name="instrumentId"
            defaultValue="please-choose"
            disabled={status === "pending"}
            className="p-2"
            onChange={handleChange}
          >
            <option disabled value="please-choose">
              Select
            </option>
            {instruments.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        )}
        <SelectClassLevel handleChange={handleChange} />
        <SelectTeacher handleChange={handleChange} />
        <AdminButton type="submit" className="col-span-2">
          Submit
        </AdminButton>
      </form>
    </div>
  );
};

export default CreateNewClass;

interface ValidateFormDataResult {
  isValid: boolean;
  errorMessages: string[];
}

const validateFormData = (
  formData: FormData,
  isStartDateUnknown: boolean,
): ValidateFormDataResult => {
  const result: ValidateFormDataResult = { isValid: false, errorMessages: [] };
  if ((formData.day as typeof formData.day & "") === "")
    result.errorMessages.push("Please choose a day.");
  if (formData.startTime === "")
    result.errorMessages.push("Start time is required.");
  if (parseInt(formData.lengthInMins) < 0)
    result.errorMessages.push("Length in minutes is too low.");
  if (formData.maxPupils < 2)
    result.errorMessages.push("Max pupils is too low.");
  if (formData.instrumentId === "")
    result.errorMessages.push("Please choose an instrument.");
  if (formData.levelId === "")
    result.errorMessages.push("Please choose a level.");
  if (formData.regularTeacherId === "")
    result.errorMessages.push("Please choose a teacher.");
  if (formData.startDate === "" && !isStartDateUnknown)
    result.errorMessages.push(
      "Please choose a start date, or set start date as unknown.",
    );

  if (result.errorMessages.length > 0)
    return { isValid: false, errorMessages: result.errorMessages };

  return { isValid: true, errorMessages: [] };
};

const SelectClassLevel = ({
  handleChange,
}: {
  handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
}) => {
  const { data: classLevels, status } = api.classes.listClassLevels.useQuery();
  switch (status) {
    case "error":
      return <p>⛔️ Error loading class levels</p>;
    case "pending":
      return <LoadingSpinner />;
    case "success":
      return (
        <>
          <label>Level ID:</label>
          <select
            name="levelId"
            defaultValue="please-choose"
            className="p-2"
            onChange={handleChange}
          >
            <option disabled value="please-choose">
              Select
            </option>
            {classLevels?.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </>
      );
  }
};
