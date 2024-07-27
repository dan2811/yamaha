import React from "react";
import { calculateAge } from "~/app/_utils/dateHelpers";
import { api } from "~/trpc/server";

const TasterLesson = async ({ params }: { params: { id: string } }) => {
  const tasterInfo = await api.taster.show({ id: params.id });
  if (!tasterInfo?.instrument?.id) {
    return <div>Taster not found</div>;
  }

  const nowPlusOneWeek = new Date(new Date().setDate(new Date().getDate() + 7));

  const availableSlots = api.taster.findAvailableLessonSlots({
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

      <div>
        <p>Available slots:</p>
      </div>
    </div>
  );
};

export default TasterLesson;
