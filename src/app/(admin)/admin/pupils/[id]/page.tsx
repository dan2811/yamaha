import React from "react";
import BackButton from "../../tasters/@show/_backButton";
import { api } from "~/trpc/server";
import { InfoCard } from "~/app/_components/admin/InfoCard";
import { calculateAge } from "~/app/_utils/dateHelpers";
import Payments from "./payments";

const PupilShow = async ({ params }: { params: { id: string } }) => {
  const pupil = await api.pupils.show({ pupilId: params.id });
  if (!pupil) return <div>Could not retrieve pupil info 😭</div>;
  return (
    <div className="h-full w-full p-2">
      <span className="flex justify-between">
        <h3 className="text-xl font-bold">
          Pupil: {pupil.fName} {pupil.lName}
        </h3>
        <span className="flex gap-2">
          <BackButton label="⬅️ Back" />
        </span>
      </span>
      <article className="grid grid-cols-1 gap-6 p-2 sm:grid-cols-2">
        <InfoCard
          info={{
            "First Name": pupil.fName,
            "Middle Name(s)": pupil.mNames ?? "",
            "Last Name": pupil.lName,
            "Date of Birth": `${new Date(
              pupil.dob,
            ).toLocaleDateString()} (${calculateAge(new Date(pupil.dob))} years old)`,
            Status: pupil.isDroppedOut ? "Dropped out" : "Active",
          }}
        />
        <div>Lessons list here</div>
        <Payments pupilId={params.id} />
      </article>
    </div>
  );
};

export default PupilShow;
