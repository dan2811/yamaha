"use client";
import type { ChangeEventHandler } from "react";
import { api } from "~/trpc/react";
import LoadingSpinner from "./LoadingSpinner";

export const SelectTeacher = ({
  handleChange,
  initialValue,
}: {
  handleChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  initialValue?: string;
}) => {
  const { data: teachers, status } = api.teacher.list.useQuery();
  switch (status) {
    case "error":
      return <p>⛔️ Error loading teachers</p>;
    case "pending":
      return <LoadingSpinner />;
    case "success":
      return (
        <>
          <label>Teacher:</label>
          <select
            name="regularTeacherId"
            defaultValue={!initialValue ? "please-choose" : initialValue}
            className="p-2"
            onChange={handleChange}
          >
            <option disabled value="please-choose">
              Select
            </option>
            {teachers?.map(({ id, user }) => (
              <option key={id} value={id}>
                {user?.name}
              </option>
            ))}
          </select>
        </>
      );
  }
};
