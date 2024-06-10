import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { createTRPCRouter, teacherProcedure } from "../trpc";
import {
  instruments,
  instrumentsToTeachers,
  teacher,
  users,
  workingHours,
} from "~/server/db/schemas";
import { zodRoles } from "~/server/types";
import { jsonAggBuildObject } from "~/server/db/drizzle-helpers";
import { randomUUID } from "crypto";
import { TRPCError } from "@trpc/server";

export const teacherRouter = createTRPCRouter({
  list: teacherProcedure
    .input(
      z
        .object({
          role: zodRoles,
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      const teachersWithInstruments = await ctx.db
        .select({
          id: teacher.id,
          instruments: jsonAggBuildObject({
            id: instruments.id,
            name: instruments.name,
          }),
          user: { id: users.id, name: users.name },
        })
        .from(teacher)
        .leftJoin(
          instrumentsToTeachers,
          eq(teacher.id, instrumentsToTeachers.teacherId),
        )
        .leftJoin(
          instruments,
          eq(instruments.id, instrumentsToTeachers.instrumentId),
        )
        .leftJoin(users, eq(users.id, teacher.userId))
        .groupBy(teacher.id, users.id);

      const allWorkingHoursGroupedByTeacher = await ctx.db
        .select({
          teacherId: workingHours.teacherId,
          workingHours: jsonAggBuildObject({
            id: workingHours.id,
            dayOfWeek: workingHours.dayOfWeek,
            startTime: workingHours.startTime,
            endTime: workingHours.endTime,
          }),
        })
        .from(workingHours)
        .groupBy(workingHours.teacherId);

      return teachersWithInstruments.map((t) => {
        return {
          ...t,
          workingHours: allWorkingHoursGroupedByTeacher.find(
            (wh) => wh.teacherId === t.id,
          )?.workingHours,
        };
      });
    }),
  show: teacherProcedure
    .input(
      z.object({
        id: z.string().nullable(),
      }),
    )
    .query(async ({ input, ctx }) => {
      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Teacher id is required",
        });
      }
      const teacherWithInstruments = await ctx.db
        .select({
          id: teacher.id,
          user: {
            id: users.id,
            name: users.name,
          },
          instruments: jsonAggBuildObject({
            id: instruments.id,
            name: instruments.name,
          }),
        })
        .from(teacher)
        .leftJoin(users, eq(users.id, teacher.userId))
        .leftJoin(
          instrumentsToTeachers,
          eq(teacher.id, instrumentsToTeachers.teacherId),
        )
        .leftJoin(
          instruments,
          eq(instruments.id, instrumentsToTeachers.instrumentId),
        )
        .where(eq(teacher.id, input.id))
        .groupBy(teacher.id, users.id)
        .limit(1);

      // Fetch the teacher and their working hours
      const teacherWithWorkingHours = await ctx.db
        .select({
          id: teacher.id,
          workingHours: jsonAggBuildObject({
            id: workingHours.id,
            dayOfWeek: workingHours.dayOfWeek,
            startTime: workingHours.startTime,
            endTime: workingHours.endTime,
          }),
        })
        .from(teacher)
        .leftJoin(workingHours, eq(workingHours.teacherId, teacher.id))
        .where(eq(teacher.id, input.id))
        .groupBy(teacher.id)
        .limit(1);

      // Combine the results
      const res = {
        ...teacherWithInstruments[0],
        workingHours: teacherWithWorkingHours[0]?.workingHours,
      };
      return res;
    }),
  addInstrument: teacherProcedure
    .input(
      z.object({
        teacherId: z.string(),
        instrumentId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { teacherId, instrumentId } = input;
      const res = await ctx.db.insert(instrumentsToTeachers).values({
        teacherId,
        instrumentId,
      });
      return res;
    }),
  removeInstrument: teacherProcedure
    .input(
      z.object({
        teacherId: z.string(),
        instrumentId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { teacherId, instrumentId } = input;
      const res = await ctx.db
        .delete(instrumentsToTeachers)
        .where(
          and(
            eq(instrumentsToTeachers.teacherId, teacherId),
            eq(instrumentsToTeachers.instrumentId, instrumentId),
          ),
        )
        .returning();
      console.log("DELETED:", res);
      return res;
    }),
  addWorkingHours: teacherProcedure
    .input(
      z.object({
        teacherId: z.string(),
        dayOfWeek: z.number(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { teacherId, dayOfWeek, startTime, endTime } = input;
      const res = await ctx.db.insert(workingHours).values({
        teacherId,
        dayOfWeek,
        startTime,
        endTime,
        id: randomUUID(),
      });
      return res;
    }),
  getWorkingHours: teacherProcedure
    .input(
      z.object({
        teacherId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const res = await ctx.db
        .select()
        .from(workingHours)
        .where(eq(workingHours.teacherId, input.teacherId));
      return res;
    }),
});
