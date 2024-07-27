"use client";
import React from "react";
import { api } from "~/trpc/react";
import BackButton from "../../@show/_backButton";
import { calculateAge } from "~/app/_utils/dateHelpers";
import { InfoCard } from "~/app/_components/admin/InfoCard";

const TasterShow = ({ params }: { params: { id: string } }) => {
  const {
    data: taster,
    isLoading,
    isError,
    error,
  } = api.taster.show.useQuery({
    id: params.id,
  });

  if (isLoading) return <p>Loading...</p>;
  if (!taster) throw new Error("No data found");

  return (
    <div className="h-full w-full p-2">
      <span className="flex justify-between">
        <h3 className="text-xl font-bold">Taster Enquiry</h3>
        <span className="flex gap-2">
          <BackButton returnPath="/admin/tasters" label="⬅️ Back to list" />
        </span>
      </span>
      {isLoading && <p>Loading...</p>}
      {isError && <p>{error.message}</p>}
      <article className="grid grid-cols-1 gap-6 p-2 sm:grid-cols-2">
        <InfoCard
          title="Student"
          info={{
            "First Name": taster.taster_enquiry.studentFirstName,
            "Middle Name(s)": taster.taster_enquiry.studentMiddleNames ?? "",
            "Last Name": taster.taster_enquiry.studentLastName,
            "Date of Birth": `${new Date(
              taster.taster_enquiry.dob,
            ).toLocaleDateString()} (${calculateAge(new Date(taster.taster_enquiry.dob))} years old)`,
            Phone: taster?.taster_enquiry.phone,
            Email: taster?.taster_enquiry.email,
            "Notes from customer": taster?.taster_enquiry.notes,
            "Internal Notes": taster?.taster_enquiry.internalNotes,
          }}
        />
        <InfoCard
          title="Lesson"
          info={{
            Instrument: taster.instrument?.name,
          }}
        />
      </article>
    </div>
  );
};

export default TasterShow;
