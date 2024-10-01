import type { InferSelectModel } from "drizzle-orm";
import type { classes } from "~/server/db/schemas";
import type { lessons } from "~/server/db/schemas";

export const getClassClashes = (
  c: InferSelectModel<typeof classes>,
  classesToCheck: InferSelectModel<typeof classes>[],
) => {
  const clashes = classesToCheck.filter((cl) => {
    if (cl.id === c.id) {
      return false;
    }
    if (cl.day !== c.day) {
      return false;
    }
    if (cl.roomId !== c.roomId) {
      return false;
    }
    if (c.startTime >= cl.startTime && c.startTime < cl.endTime) {
      return true;
    }
    if (c.endTime > cl.startTime && c.endTime <= cl.endTime) {
      return true;
    }
    if (c.startTime <= cl.startTime && c.endTime >= cl.endTime) {
      return true;
    }
    return false;
  });
  return clashes;
};

export const findEarliestClass = (
  classesToCheck: (
    | InferSelectModel<typeof classes>
    | InferSelectModel<typeof lessons>
  )[],
) => {
  let earliestClass = classesToCheck[0];
  classesToCheck.forEach((cl) => {
    if (cl.startTime < earliestClass!.startTime) {
      earliestClass = cl;
    }
  });
  return earliestClass;
};

export const findLatestClass = (
  classesToCheck: (
    | InferSelectModel<typeof classes>
    | InferSelectModel<typeof lessons>
  )[],
) => {
  let latestClass = classesToCheck[0];
  classesToCheck.forEach((cl) => {
    if (cl.startTime > latestClass!.startTime) {
      latestClass = cl;
    }
  });
  return latestClass;
};
