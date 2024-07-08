"use client";
import AdminButton from "./Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useRef } from "react";
import { getYamahaMonthStartEnd } from "~/app/_utils/dateHelpers";

export const DateRangeFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const path = usePathname();

  const form = useRef<HTMLFormElement>(null);

  const { defaultStartDate, defaultEndDate } = getYamahaMonthStartEnd();

  const setDateRange = (startDate: string, endDate: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("startDate", startDate);
    newParams.set("endDate", endDate);
    router.replace(`${path}?${newParams.toString()}`);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const startDate = target.startDate as HTMLInputElement;
    const endDate = target.endDate as HTMLInputElement;

    const newParams = new URLSearchParams(searchParams.toString());

    if (startDate.value) {
      newParams.set("startDate", startDate.value);
    } else {
      console.log("deleting params");
    }

    if (endDate.value) {
      newParams.set("endDate", endDate.value);
    } else {
      newParams.delete("endDate");
    }
    router.replace(`${path}?${newParams.toString()}`);
  };

  const handleChange = () => {
    form.current?.submit();
  };
  return (
    <form
      className="flex flex-col gap-4 rounded bg-purple-500/20 p-2"
      ref={form}
      onSubmit={onSubmit}
    >
      <div className="flex items-center gap-2 rounded p-2">
        <p>Start: </p>
        <input
          type="date"
          name="startDate"
          value={searchParams.get("startDate") ?? defaultStartDate}
          onChange={handleChange}
        />
        <p>End:</p>
        <input
          type="date"
          name="endDate"
          value={searchParams.get("endDate") ?? defaultEndDate}
          onChange={handleChange}
        />
      </div>
      <div className="flex justify-evenly gap-2 rounded pb-2">
        <AdminButton
          onClick={(e) => {
            e.preventDefault();
            const startDate = searchParams.get("startDate") ?? defaultStartDate;
            const endDate = searchParams.get("endDate") ?? defaultEndDate;
            const startDateMinus1Month = new Date(
              new Date(startDate).setMonth(new Date(startDate).getMonth() - 1),
            )
              .toISOString()
              .split("T")[0]!;

            const endDateMinus1Month = new Date(
              new Date(endDate).setMonth(new Date(endDate).getMonth() - 1),
            )
              .toISOString()
              .split("T")[0]!;
            setDateRange(startDateMinus1Month, endDateMinus1Month);
          }}
        >
          - 1 Month
        </AdminButton>
        <AdminButton
          onClick={(e) => {
            e.preventDefault();
            setDateRange(defaultStartDate, defaultEndDate);
          }}
        >
          ↺ Reset
        </AdminButton>
        <AdminButton
          onClick={(e) => {
            e.preventDefault();
            const startDate = searchParams.get("startDate") ?? defaultStartDate;
            const endDate = searchParams.get("endDate") ?? defaultEndDate;
            const startDatePlus1Month = new Date(
              new Date(startDate).setMonth(new Date(startDate).getMonth() + 1),
            )
              .toISOString()
              .split("T")[0]!;

            const endDatePlus1Month = new Date(
              new Date(endDate).setMonth(new Date(endDate).getMonth() + 1),
            )
              .toISOString()
              .split("T")[0]!;
            setDateRange(startDatePlus1Month, endDatePlus1Month);
          }}
        >
          + 1 Month
        </AdminButton>
      </div>
    </form>
  );
};
