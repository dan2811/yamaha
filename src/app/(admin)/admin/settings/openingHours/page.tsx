import React from "react";
import { days } from "~/server/types";
import OpeningHoursCard from "./openingHoursCard";
import { api } from "~/trpc/server";

const page = async () => {
  const result = await api.openingHours.list();
  console.log("yooo", result);
  return (
    <div className="flex flex-wrap gap-2">
      {days.map((day) => (
        <OpeningHoursCard
          key={day}
          day={day}
          hours={result.find((r) => r.day === day)}
        />
      ))}
    </div>
  );
};

export default page;
