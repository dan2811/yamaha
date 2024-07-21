"use client";
import React, { type ChangeEventHandler, useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { InfoCard } from "~/app/_components/admin/InfoCard";
import { parseDbTime } from "~/app/_utils/dateHelpers";
import BackButton from "../../../tasters/@show/_backButton";
import { days } from "~/server/types";
import { SelectTeacher } from "~/app/_components/admin/SelectTeacher";
import AdminButton from "~/app/_components/admin/Button";
import toast from "react-hot-toast";
import LoadingSpinner from "~/app/_components/admin/LoadingSpinner";
import { type UpdateClassFormData, updateClass } from "../serverActions";
import { useRouter } from "next/navigation";
import { SelectRoom } from "~/app/_components/admin/SelectRoom";

const EditNewClass = ({ params: { id } }: { params: { id: string } }) => {
  const { data, isLoading, isError, error, isSuccess } =
    api.classes.showNewClasses.useQuery({
      id,
    });

  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState<UpdateClassFormData>({
    classId: id,
    day: "Monday",
    regularTeacherId: "",
    startTime: "",
    startDate: "",
    roomId: "",
  });

  useEffect(() => {
    if (isSuccess && data) {
      setFormData({
        classId: id,
        day: data.classes.day,
        regularTeacherId: data.teacher?.id ? data.teacher.id : "",
        startTime: data.classes.startTime,
        startDate: data.classes.startDate ?? "",
        roomId: data.room?.id ?? "",
      });
    }
  }, [data, isSuccess, id]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error.message}</p>;

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (updating) return <LoadingSpinner />;

  return (
    <div className="h-full w-full p-2">
      <span className="flex justify-between">
        <h3 className="text-xl font-bold">New Class</h3>
        <span className="flex gap-2">
          <BackButton
            returnPath="/admin/newClasses/list"
            label="⬅️ Back to list"
          />
        </span>
      </span>
      <article className="grid grid-cols-1 gap-6 p-2 sm:grid-cols-2">
        <InfoCard
          title="Old"
          info={{
            Day: data?.classes.day,
            Time: data?.classes.startTime
              ? parseDbTime(data?.classes.startTime)
              : "Unknown",
            "Start Date": data?.classes.startDate
              ? new Date(data?.classes.startDate).toLocaleDateString()
              : "",
            Teacher: data?.user?.name,
            Instrument: data?.instrument?.name,
            Room: data?.room?.name,
          }}
        />
        <form
          className="flex flex-col space-y-2 rounded-md bg-purple-500/10 p-4 shadow-md shadow-purple-900/80"
          action={async () => {
            const userConfirmed = window.confirm(
              "Are you sure you want to edit this class?",
            );
            if (!userConfirmed) return;
            try {
              setUpdating(true);
              await updateClass(formData);
              toast.success("Class updated");
              router.push(`/admin/newClasses/${id}`);
            } catch (e) {
              toast.error(
                e instanceof Error
                  ? e.message
                  : typeof e === "string"
                    ? e
                    : JSON.stringify(e),
              );
            } finally {
              setUpdating(false);
            }
          }}
        >
          <h3 className="text-lg font-bold">New</h3>
          <label>Day</label>
          <select
            className="p-2"
            name="day"
            onChange={handleChange}
            value={formData.day}
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <label>Start Time</label>
          <input
            name="startTime"
            onChange={handleChange}
            type="time"
            className="p-2"
            value={formData.startTime}
          />
          <label>Start Date</label>
          <input
            name="startDate"
            onChange={handleChange}
            type="date"
            className="p-2"
            value={
              formData.startDate
                ? new Date(formData.startDate).toISOString().split("T")[0]
                : ""
            }
          />
          <SelectTeacher
            handleChange={handleChange}
            initialValue={data?.teacher?.id}
          />
          <SelectRoom
            handleChange={handleChange}
            initialValue={data?.room?.id}
          />
          <AdminButton type="submit" className="w-fit place-self-center px-6">
            Save
          </AdminButton>
        </form>
      </article>
    </div>
  );
};

export default EditNewClass;
