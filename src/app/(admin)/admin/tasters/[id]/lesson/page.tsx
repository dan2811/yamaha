import React from "react";
import { calculateAge } from "~/app/_utils/dateHelpers";
import type { Day } from "~/server/types";
import { api } from "~/trpc/server";

const TasterLesson = async ({ params }: { params: { id: string } }) => {
  const tasterInfo = await api.taster.show({ id: params.id });
  if (!tasterInfo?.instrument?.id) {
    return <div>Taster not found</div>;
  }

  const nowPlusOneWeek = new Date(new Date().setDate(new Date().getDate() + 7));

  const availableSlots = await api.taster.findAvailableLessonSlots({
    startDate: new Date(),
    endDate: nowPlusOneWeek,
    instrumentId: tasterInfo.instrument?.id,
  });

  return (
    <div>
      <p>
        Age of pupil: {calculateAge(new Date(tasterInfo.taster_enquiry.dob))}
      </p>
      <p>Instrument: {tasterInfo?.instrument?.name}</p>

      <h2>Available slots</h2>
      {Object.keys(availableSlots).map((teacherId) => (
        <div key={teacherId}>
          <h2>Teacher ID: {teacherId}</h2>
          {availableSlots[teacherId] &&
            Object.keys(availableSlots[teacherId]).map((dayName) => (
              <div key={dayName}>
                <h3>{dayName}</h3>
                <ul>
                  {availableSlots[teacherId] && [dayName] &&
                    availableSlots[teacherId][dayName as Day].map(
                      (timeSlot, index) => <li key={index}>{timeSlot}</li>,
                    )}
                </ul>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default TasterLesson;
