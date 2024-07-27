"use client";
import React, { useState, type ReactNode } from "react";
import EditInstrumentsModal from "./AddInstrumentToTeacherModal";
import AdminButton from "~/app/_components/admin/Button";
import InstrumentPill from "~/app/_components/admin/InstrumentPill";
import { api } from "~/trpc/react";
import { type Day, days } from "~/server/types";
import {
  parseDbTime,
  transformNumberToWeekDay,
} from "~/app/_utils/dateHelpers";
import WorkingHoursCard from "./WorkingHoursCard";

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

  const {
    data: allWorkingHours,
    isLoading: workingHoursIsLoading,
    refetch,
  } = api.teacher.getWorkingHours.useQuery({
    teacherId: id,
  });

  const [isEditInstrumentsOpen, setIsEditInstrumentsOpen] = useState(false);

  if (!teacher) {
    return <div>Teacher not found</div>;
  }
  return (
    <div className="flex w-full flex-col gap-4 rounded-lg bg-purple-200/60 p-6 text-purple-950">
      <h3 className="text-2xl font-medium">{teacher.user?.name}</h3>
      <div>
        <p className="font-light">Instruments</p>
        <div className="flex flex-wrap gap-2">
          {teacher.instruments?.length &&
            teacher.instruments.map(({ name, id }) => {
              return (
                <InstrumentPill
                  instrumentId={id}
                  name={name}
                  teacherId={id}
                  onDelete={() => {
                    void refetchTeachers();
                    void refetchInstruments();
                  }}
                  key={id + teacher.id}
                />
              );
            })}
          <AdminButton onClick={() => setIsEditInstrumentsOpen(true)}>
            + Add Instrument
          </AdminButton>
        </div>
      </div>
      <div>
        <p className="font-light">Working days</p>
        <div className="flex flex-wrap gap-2">
          {days.map((day) => (
            <WorkingHoursCard
              key={day + id + teacher.id}
              hours={allWorkingHours?.filter((wh) => wh.day === day)[0]}
              day={day}
              teacherId={id}
              refetch={refetch}
            />
          ))}
        </div>
      </div>
      <EditInstrumentsModal
        refetchInstruments={refetchInstruments}
        allInstrumentsIsLoading={allInstrumentsIsLoading}
        allInstruments={allInstruments}
        teacherId={id}
        isOpen={isEditInstrumentsOpen}
        setIsOpen={setIsEditInstrumentsOpen}
        onComplete={() => refetchTeachers()}
      />
    </div>
  );
};

export default EditTeacher;
