import { z } from "zod";
import { createTRPCRouter, teacherProcedure } from "../trpc";
import { zodAttendanceValues, zodDays } from "~/server/types";
import {
  attendance,
  classes,
  classesToPupils,
  lessons,
  pupils,
} from "~/server/db/schemas";
import {
  and,
  eq,
  getTableColumns,
  gte,
  InferInsertModel,
  lte,
} from "drizzle-orm";
import { jsonAggBuildObject } from "~/server/db/drizzle-helpers";
import { randomUUID } from "crypto";
import { TRPCError } from "@trpc/server";

export const registerRouter = createTRPCRouter({
  getClassesForDay: teacherProcedure
    .input(
      z.object({
        day: zodDays,
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const result = ctx.db
        .select({
          ...getTableColumns(classes),
          lessons: jsonAggBuildObject(getTableColumns(lessons)),
        })
        .from(classes)
        .leftJoin(lessons, eq(classes.id, lessons.classId))
        .where(eq(classes.day, input.day))
        .groupBy(classes.id);

      return result;
    }),
  getPupilsForClass: teacherProcedure
    .input(
      z.object({
        classId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      // get all the pupils for a class, using classesToPupils as a join table
      return await ctx.db
        .select({
          ...getTableColumns(pupils),
        })
        .from(pupils)
        .leftJoin(classesToPupils, eq(pupils.id, classesToPupils.pupilId))
        .where(eq(classesToPupils.classId, input.classId));
    }),
  getAttendanceForLesson: teacherProcedure
    .input(
      z.object({
        classId: z.string(),
        date: z.date(),
        pupilId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const [lesson] = await ctx.db
        .select()
        .from(lessons)
        .where(
          and(
            eq(lessons.classId, input.classId),
            eq(lessons.date, input.date.toISOString()),
          ),
        )
        .limit(1);

      if (!lesson) {
        return undefined;
      }

      const res = await ctx.db
        .select()
        .from(attendance)
        .where(
          and(
            eq(attendance.lessonId, lesson.id),
            eq(attendance.pupilId, input.pupilId),
          ),
        )
        .limit(1);
      return res[0] ?? undefined;
    }),
  markAttendance: teacherProcedure
    .input(
      z.object({
        classId: z.string(),
        date: z.date(),
        pupilId: z.string(),
        value: zodAttendanceValues.nullable(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [lesson] = await ctx.db
        .select()
        .from(lessons)
        .where(
          and(
            eq(lessons.classId, input.classId),
            eq(lessons.date, input.date.toISOString()),
          ),
        )
        .limit(1);

      if (!lesson) {
        try {
          const [classs] = await ctx.db
            .select()
            .from(classes)
            .where(eq(classes.id, input.classId))
            .limit(1);

          console.log("selected class", classs);

          if (
            !classs?.regularTeacherId ||
            !classs?.roomId ||
            !classs?.lengthInMins
          ) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Class does not have all required fields",
            });
          }

          const [lesson] = await ctx.db
            .insert(lessons)
            .values({
              date: input.date.toISOString(),
              classId: input.classId,
              lengthInMins: classs.lengthInMins,
              roomId: classs.roomId,
              startTime: classs.startTime,
              teacherId: classs.regularTeacherId,
            })
            .returning();

          if (!lesson) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Could not create lesson",
            });
          }

          await ctx.db.insert(attendance).values({
            lessonId: lesson.id,
            pupilId: input.pupilId,
            value: input.value,
          });
          return;
        } catch (error) {
          console.error(error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: error,
          });
        }
      }

      await ctx.db.insert(attendance).values({
        lessonId: lesson.id,
        pupilId: input.pupilId,
        value: input.value,
      });
    }),
  getLessonForClass: teacherProcedure
    .input(z.object({ classId: z.string(), date: z.date() }))
    .query(async ({ input, ctx }) => {
      // get all lessons for a class between two dates
      const res = await ctx.db
        .select()
        .from(lessons)
        .where(
          and(
            eq(lessons.classId, input.classId),
            eq(lessons.date, input.date.toISOString()),
          ),
        )
        .limit(1);

      return res[0] ?? null;
    }),
  getLessonsForClass: teacherProcedure
    .input(z.object({ classId: z.string(), after: z.date(), before: z.date() }))
    .query(async ({ input, ctx }) => {
      // get all lessons for a class between two dates
      return await ctx.db
        .select()
        .from(lessons)
        .where(
          and(
            eq(lessons.classId, input.classId),
            gte(lessons.date, input.after.toISOString()),
            lte(lessons.date, input.before.toISOString()),
          ),
        );
    }),
});
