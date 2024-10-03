import React from "react";
import { days } from "~/server/types";
import OpeningHoursCard from "./openingHoursCard";
import { api } from "~/trpc/server";
import BackButton from "../../tasters/@show/_backButton";

const page = async () => {
  const result = await api.openingHours.list();
  const { role } = await api.users.getCurrentUser();

  return (
    <div>
      <span className="flex justify-between pb-2">
        <h2 className="text-xl font-bold">Opening Times</h2>
        <BackButton />
      </span>
      <div className="flex flex-wrap gap-2">
        {days.map((day) => (
          <OpeningHoursCard
            key={day}
            day={day}
            hours={result.find((r) => r.day === day)}
            disabled={role !== "superAdmin"}
          />
        ))}
      </div>
    </div>
  );
};

export default page;
