"use client";
import React from "react";
import { api } from "~/trpc/react";
import TasterStatus from "./status";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TasterList = () => {
  const { data, isLoading, isError, error } = api.taster.list.useQuery({});

  const [selectedRow, setSelectedRow] = React.useState<string | null>(null);

  const router = useRouter();

  const handleRowClick = (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    setSelectedRow(id);
  };

  console.log(data);
  return (
    <div className="h-screen w-full">
      <table className="w-full table-auto">
        <thead className="border-b-2 border-purple-500/40 text-left">
          <tr>
            <th className="p-2">Status</th>
            <th className="border-x-2 border-purple-500/40 p-2">
              Enquiry Date
            </th>
            <th className="border-x-2 border-purple-500/40 p-2">Pupil Name</th>
            <th className="p-2">DOB</th>
            <th className="border-x-2 border-purple-500/40 p-2">Instrument</th>
            <th className="p-2">Notes from customer</th>
            <th className="border-l-2 border-purple-500/40 p-2">
              Internal Notes
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map(({ taster_enquiry: taster, instrument }, index) => {
            console.log("INTERNAL NOT: ", taster.internalNotes);
            return (
              <tr
                title={"test"}
                key={index}
                className={
                  selectedRow === taster.id
                    ? "bg-purple-500/80"
                    : "" +
                      "cursor-pointer border-b-2 border-purple-500/20 hover:bg-purple-500/40"
                }
                onClick={() => router.push(`/admin/tasters/${taster.id}`)}
              >
                <td className="flex items-center justify-center">
                  <TasterStatus status={taster.status} />
                </td>
                <td>{new Date(taster.createdAt).toLocaleString()}</td>
                <td className="line-clamp-2 max-w-sm overflow-auto">
                  <Link href={`tasters/${taster.id}`}>
                    {`${taster.studentFirstName} ${taster.studentLastName}`}
                  </Link>
                </td>
                <td>{new Date(taster.dob).toLocaleDateString()}</td>
                <td>{instrument?.name}</td>
                <td className="max-w-xs overflow-auto">{taster.notes ?? ""}</td>
                <td
                  className="line-clamp-2 max-w-sm overflow-ellipsis"
                  title={taster.internalNotes ?? ""}
                >
                  {taster.internalNotes ?? ""}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TasterList;
