"use client";
import React, { type ReactNode } from "react";
import EditInstruments from "~/app/_components/admin/AddInstrumentToTeacherModal";
import AdminButton from "~/app/_components/admin/Button";
import InstrumentPill from "~/app/_components/admin/InstrumentPill";
import { api } from "~/trpc/react";

const EditTeacher = ({
  params: { id },
}: {
  params: { id: string };
  children: ReactNode;
}) => {
  const { data: teacher, refetch: refetchTeachers } = api.teacher.show.useQuery(
    { id },
  );
  const {
    data: allInstruments,
    isLoading: allInstrumentsIsLoading,
    refetch: refetchInstruments,
  } = api.instrument.list.useQuery();

  const [isOpen, setIsOpen] = React.useState(false);
  if (!teacher) {
    return <div>Teacher not found</div>;
  }
  return (
    <div className="flex w-full flex-col gap-2 rounded-lg bg-purple-200/60 p-6 text-purple-950">
      <h3 className="text-2xl font-medium">{teacher.user?.name}</h3>
      <p className="font-light">Instruments</p>
      <div className="flex gap-2">
        {teacher.instruments.map(({ name, id }) => (
          <InstrumentPill
            instrumentId={id}
            name={name}
            teacherId={teacher.id}
            onDelete={() => {
              void refetchTeachers();
              void refetchInstruments();
            }}
            key={teacher.id + id}
          />
        ))}
        <AdminButton onClick={() => setIsOpen(true)}>
          + Add Instrument
        </AdminButton>
      </div>
      <EditInstruments
        refetchInstruments={refetchInstruments}
        allInstrumentsIsLoading={allInstrumentsIsLoading}
        allInstruments={allInstruments}
        teacherId={id}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onComplete={() => refetchTeachers()}
      />
    </div>
  );
};

export default EditTeacher;
