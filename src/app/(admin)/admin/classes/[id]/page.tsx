import React from "react";
import { parseDbTime } from "~/app/_utils/dateHelpers";
import { api } from "~/trpc/server";
import BackButton from "../../tasters/@show/_backButton";

const ShowClass = async ({ params }: { params: { id: string } }) => {
  const [c] = await api.classes.show({ id: params.id });
  if (!c) {
    return <div>Class not found</div>;
  }
  const teacher = await api.teacher.show({ id: c.regularTeacherId });
  const instrument = await api.instrument.show({ id: c.instrumentId });
  let classLevel;
  let classType;
  if (c.typeId) {
    classType = await api.classType.show({ classTypeId: c.typeId });
  }
  if (c.levelId) {
    [classLevel] = await api.classes.showClassLevel({
      classLevelId: c.levelId,
    });
  }
  return (
    <div>
      <BackButton />
      <h1>
        {teacher.user?.name} {instrument?.name} {parseDbTime(c.startTime)}{" "}
        {c.day}
      </h1>
      <h2>
        {classLevel?.name ?? ""} {classType?.name ?? ""}
      </h2>
    </div>
  );
};

export default ShowClass;
