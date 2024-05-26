"use client";
import React from "react";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";

const InstrumentPill = ({
  teacherId,
  instrumentId,
  name,
  onDelete,
}: {
  teacherId: string;
  instrumentId: string;
  name: string;
  onDelete: () => void;
}) => {
  const { mutateAsync, reset } = api.teacher.removeInstrument.useMutation();

  return (
    <div className="flex items-center gap-2 rounded-full border-2 border-purple-600 bg-purple-300 p-2 text-purple-950">
      <p className="ml-2">{name}</p>
      <button
        className="rounded-full bg-purple-400 px-2 py-1 hover:bg-purple-500/80"
        title="Delete"
        onClick={async () => {
          await mutateAsync(
            { teacherId, instrumentId },
            {
              onSuccess: () => {
                toast.success("Instrument removed successfully");
                onDelete();
              },
              onError: (error) => {
                toast.error(error.message);
                reset();
              },
            },
          );
        }}
      >
        ❌
      </button>
    </div>
  );
};

export default InstrumentPill;
