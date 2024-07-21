import { z } from "zod";
import { and, count, eq, gte, isNull, lte, or } from "drizzle-orm";
import { createTRPCRouter, teacherProcedure } from "../trpc";
import {
  classLevel,
  classes,
  classesToPupils,
  instruments,
  pupils,
  rooms,
  teacher,
  users,
} from "~/server/db/schemas";
import { TRPCError } from "@trpc/server";
import { jsonAggBuildObject } from "~/server/db/drizzle-helpers";
import { zodDays } from "~/server/types";
import { randomUUID } from "crypto";

export const classesRouter = createTRPCRouter({
  showClassLevel: teacherProcedure
    .input(z.object({ classLevelId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select()
        .from(classLevel)
        .where(eq(classLevel.id, input.classLevelId))
        .limit(1);
    }),
  listNewClasses: teacherProcedure.query(async ({ input, ctx }) => {
    // includes classes that have started in the last 2 weeks
    const weeksToShowNewClassesFor = 2;
    const newClassDateThreshold = new Date(
      new Date().setDate(new Date().getDate() - weeksToShowNewClassesFor * 7),
    );
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
      .where(
        or(
          gte(classes.startDate, newClassDateThreshold.toISOString()),
          isNull(classes.startDate),
        ),
      )
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
        .leftJoin(rooms, eq(classes.roomId, rooms.id))
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
        lengthInMins: z.number(),
        day: zodDays,
        maxPupils: z.number(),
        startDate: z.string(),
        instrumentId: z.string(),
        levelId: z.string(),
        regularTeacherId: z.string(),
        roomId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .insert(classes)
        .values({
          ...input,
          id: randomUUID(),
          lengthInMins: input.lengthInMins,
          startDate: input.startDate === "" ? undefined : input.startDate,
        })
        .returning();
    }),
  listPupils: teacherProcedure
    .input(z.object({ classId: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(classesToPupils)
        .where(eq(classesToPupils.classId, input.classId))
        .leftJoin(pupils, eq(classesToPupils.pupilId, pupils.id));
      return result;
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
