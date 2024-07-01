import { z } from "zod";
import { and, count, eq } from "drizzle-orm";
import { createTRPCRouter, teacherProcedure } from "../trpc";
import {
  classLevel,
  classes,
  classesToPupils,
  instruments,
  teacher,
  users,
} from "~/server/db/schemas";
import { TRPCError } from "@trpc/server";
import { jsonAggBuildObject } from "~/server/db/drizzle-helpers";
import { zodDays } from "~/server/types";
import { randomUUID } from "crypto";

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
  listClassLevels: teacherProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.select().from(classLevel);
    return res;
  }),
  createNewClass: teacherProcedure
    .input(
      z.object({
        startTime: z.string(),
        lengthInMins: z.string(),
        day: zodDays,
        maxPupils: z.number(),
        startDate: z.string(),
        instrumentId: z.string(),
        levelId: z.string(),
        regularTeacherId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .insert(classes)
        .values({
          ...input,
          isStarted: false,
          id: randomUUID(),
          lengthInMins: input.lengthInMins,
          startDate: input.startDate === "" ? undefined : input.startDate,
        })
        .execute();
    }),
  listPupils: teacherProcedure
    .input(z.object({ classId: z.string() }))
    .query(async ({ ctx, input }) => {
      const res = await ctx.db
        .select({
          pupils: jsonAggBuildObject({
            pupilId: classesToPupils.pupilId,
          }),
        })
        .from(classes)
        .leftJoin(classesToPupils, eq(classes.id, classesToPupils.classId))
        .where(eq(classes.isStarted, false))
        .groupBy(classes.id);
      return res[0];
    }),
  removePupilFromClass: teacherProcedure
    .input(
      z.object({
        classId: z.string(),
        pupilId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db
          .delete(classesToPupils)
          .where(
            and(
              eq(classesToPupils.classId, input.classId),
              eq(classesToPupils.pupilId, input.pupilId),
            ),
          );
        return { success: true };
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to remove pupil from class",
          cause:
            e instanceof Error
              ? e.message
              : typeof e === "string"
                ? e
                : JSON.stringify(e),
        });
      }
    }),
});
