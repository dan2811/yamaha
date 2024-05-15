"use client";
import React from "react";
import LoadingSpinner from "~/app/_components/admin/LoadingSpinner";
import { api } from "~/trpc/react";

const InstrumentSelect = ({
  className,
  onChange,
  value,
  id,
}: {
  className: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  value: string;
  id: string;
}) => {
  const {
    data: instruments,
    isLoading,
    isError,
    error,
  } = api.instrument.list.useQuery({});
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <p>Error loading instruments - {error.message}</p>;
  if (!instruments) return <p>No instruments found</p>;
  return (
    <select
      className={className}
      onChange={(e) => {
        console.log("instrument select onChange", e.target.value);
        onChange(e.target.value);
      }}
      value={value}
      id={id}
      defaultValue={instruments[0]?.id}
    >
      <option value="" disabled>
        Instrument
      </option>
      {instruments?.map((instr) => (
        <option key={instr.id} value={instr.id}>
          {instr.name}
        </option>
      ))}
    </select>
  );
};

export default InstrumentSelect;
