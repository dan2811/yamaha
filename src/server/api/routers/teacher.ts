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
      const res = await ctx.db
        .select({
          id: teacher.id,
          instruments: jsonAggBuildObject({ id: instruments.id, name: instruments.name }),
          user: { id: users.id, name: users.name },
          workingHours: jsonAggBuildObject({
            id: workingHours.id,
            dayOfWeek: workingHours.dayOfWeek,
            startTime: workingHours.startTime,
            endTime: workingHours.endTime,
          }),
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
        .leftJoin(workingHours, eq(workingHours.teacherId, teacher.id))
        .groupBy(teacher.id, users.id);
      return res;
    }),
  show: teacherProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const res = await ctx.db
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
        workingHours: jsonAggBuildObject({
          id: workingHours.id,
          dayOfWeek: workingHours.dayOfWeek,
          startTime: workingHours.startTime,
          endTime: workingHours.endTime,
        }),
      })
      .from(teacher)
      .leftJoin(users, eq(users.id, teacher.userId))
      .leftJoin(instrumentsToTeachers, eq(teacher.id, instrumentsToTeachers.teacherId))
      .leftJoin(instruments, eq(instruments.id, instrumentsToTeachers.instrumentId))
      .leftJoin(workingHours, eq(workingHours.teacherId, teacher.id))
      .where(eq(teacher.id, input.id))
      .groupBy(teacher.id, users.id).limit(1);

      return res[0];
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
});
