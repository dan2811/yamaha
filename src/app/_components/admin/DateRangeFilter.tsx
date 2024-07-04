"use client";
import AdminButton from "./Button";
import { useSearchParams } from "next/navigation";
import { type FormEvent, useRef } from "react";
import { getYamahaMonthStartEnd } from "~/app/_utils/dateHelpers";

export const DateRangeFilter = () => {
  const searchParams = useSearchParams();

  const form = useRef<HTMLFormElement>(null);

  const { defaultStartDate, defaultEndDate } = getYamahaMonthStartEnd();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const startDate = target.startDate as HTMLInputElement;
    const endDate = target.endDate as HTMLInputElement;

    const newParams = new URLSearchParams(searchParams.toString());

    if (startDate.value) {
      newParams.set("startDate", startDate.value);
    } else {
      newParams.delete("startDate");
    }

    if (endDate.value) {
      newParams.set("endDate", endDate.value);
    } else {
      newParams.delete("endDate");
    }
  };

  const handleChange = () => {
    form.current?.submit();
  };
  return (
    <form
      className="flex items-center gap-2 rounded bg-purple-500/20 p-2"
      ref={form}
      onSubmit={onSubmit}
    >
      <p>Start: </p>
      <input
        type="date"
        name="startDate"
        defaultValue={searchParams.get("startDate") ?? defaultStartDate}
        onChange={handleChange}
      />
      <p>End:</p>
      <input
        type="date"
        name="endDate"
        defaultValue={searchParams.get("endDate") ?? defaultEndDate}
        onChange={handleChange}
      />
      <AdminButton onClick={() => onSubmit({} as FormEvent<HTMLFormElement>)}>
        Reset
      </AdminButton>
    </form>
  );
};
