"use client";
import React from "react";
import { api } from "~/trpc/react";
import BackButton from "../../@show/_backButton";
import TasterStatus from "../../status";
import AdminButton from "~/app/_components/admin/Button";
import { usePathname, useRouter } from "next/navigation";
import { calculateAge } from "~/app/_utils/calculateAge";
import CopyToClipboardButton from "~/app/_components/admin/CopyToClipboardButton";

const TasterShow = ({ params }: { params: { id: string } }) => {
  const { data, isLoading, isError, error } = api.taster.show.useQuery({
    id: params.id,
  });

  const router = useRouter();
  const path = usePathname();

  if (isLoading) return <p>Loading...</p>;
  if (!data ?? !data?.length ?? !data[0]) throw new Error("No data found");
  const taster = data[0];
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
      {data?.length && (
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
      )}
    </div>
  );
};

export default TasterShow;

const InfoCard = ({
  info,
  children,
  title,
}: {
  title: string;
  info: Record<string, string | undefined | null>;
  children?: React.ReactNode;
}) => {
  return (
    <section className="rounded-md bg-purple-500/10 p-4 shadow-md shadow-purple-900/80">
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-bold">{title}</h3>
        {Object.entries(info).map(([key, value]) => (
          <div key={key}>
            <label className="font-light">{key}:</label>
            <span className="flex">
              <p className="w-fit overflow-auto rounded p-1 md:text-lg">
                {!value ? "-" : value}
              </p>
              <CopyToClipboardButton
                textToCopy={value}
                className="px-2 hover:bg-slate-300/50"
              />
            </span>
          </div>
        ))}
      </div>
      {children}
    </section>
  );
};
