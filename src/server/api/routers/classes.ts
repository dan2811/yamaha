import { z } from "zod";
import { count, eq } from "drizzle-orm";
import { createTRPCRouter, teacherProcedure } from "../trpc";
import {
  classes,
  classesToPupils,
  instruments,
  teacher,
  users,
} from "~/server/db/schemas";
import { TRPCError } from "@trpc/server";
import { jsonAggBuildObject } from "~/server/db/drizzle-helpers";

export const classesRouter = createTRPCRouter({
  listNewClasses: teacherProcedure.query(async ({ input, ctx }) => {
    const res = await ctx.db
      .select({
        id: classes.id,
        day: classes.day,
        instrumentId: classes.instrumentId,
        regularTeacherId: classes.regularTeacherId,
        startTime: classes.startTime,
        maxPupils: classes.maxPupils,
        pupils: jsonAggBuildObject({
          pupilId: classesToPupils.pupilId,
        }),
        pupilsCount: count(classesToPupils.pupilId),
      })
      .from(classes)
      .where(eq(classes.isStarted, false))
      .leftJoin(classesToPupils, eq(classes.id, classesToPupils.classId))
      .groupBy(classes.id);
    return res;
  }),
  showNewClasses: teacherProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const res = await ctx.db
        .select()
        .from(classes)
        .where(eq(classes.id, input.id))
        .leftJoin(teacher, eq(classes.regularTeacherId, teacher.id))
        .leftJoin(users, eq(teacher.userId, users.id))
        .leftJoin(classesToPupils, eq(classes.id, classesToPupils.classId))
        .leftJoin(instruments, eq(classes.instrumentId, instruments.id))
        .limit(1);
      if (res.length === 0)
        throw new TRPCError({
          code: "NOT_FOUND",
          cause: `Class with id: ${input.id} does not exist.`,
          message: "Class not found",
        });
      return res[0];
    }),
});
