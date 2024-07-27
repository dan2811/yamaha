import { z } from "zod";
import { or, like, eq, and } from "drizzle-orm";
import { createTRPCRouter, teacherProcedure } from "../trpc";
import {
  insertTasterEnquiryZodSchema,
  instruments,
  instrumentsToTeachers,
  tasterEnquiry,
  teacher,
  workingHours,
} from "~/server/db/schemas";
import { randomUUID } from "crypto";
import { jsonAggBuildObject } from "~/server/db/drizzle-helpers";

export const tasterRouter = createTRPCRouter({
  create: teacherProcedure
    .input(
      z.object({
        email: z.string().email(),
        phone: z.string(),
        firstName: z.string().min(1),
        middleName: z.string().optional(),
        lastName: z.string().min(1),
        dob: z.string(),
        instrumentId: z.string(),
        internalNotes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db
        .insert(tasterEnquiry)
        .values({
          id: randomUUID(),
          email: input.email,
          phone: input.phone,
          studentFirstName: input.firstName,
          studentMiddleNames: input.middleName,
          studentLastName: input.lastName,
          dob: input.dob,
          instrumentId: input.instrumentId,
          status: "Awaiting admin action",
          internalNotes: input.internalNotes,
          createdAt: new Date().toISOString(),
        })
        .returning();
      return res[0];
    }),
  list: teacherProcedure
    .input(
      z.object({
        search: z.string().optional(),
        instrumentId: z.string().optional(),
        date_gte: z.date().optional(),
        date_lte: z.date().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { search, instrumentId } = input ?? {};
      const conditions = [];

      if (search) {
        conditions.push(
          or(
            like(tasterEnquiry.email, `%${search}%`),
            like(tasterEnquiry.studentFirstName, `%${search}%`),
            like(tasterEnquiry.studentMiddleNames, `%${search}%`),
            like(tasterEnquiry.studentLastName, `%${search}%`),
            like(tasterEnquiry.phone, `%${search}%`),
            like(tasterEnquiry.notes, `%${search}%`),
            like(tasterEnquiry.internalNotes, `%${search}%`),
          ),
        );
      }

      if (instrumentId) {
        conditions.push(eq(tasterEnquiry.instrumentId, instrumentId));
      }

      const res = await ctx.db
        .select()
        .from(tasterEnquiry)
        .where(and(...conditions))
        .leftJoin(instruments, eq(tasterEnquiry.instrumentId, instruments.id));
      return res;
    }),
  show: teacherProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async ({ input: { id }, ctx }) => {
      if (!id) return null;
      const res = await ctx.db
        .select()
        .from(tasterEnquiry)
        .where(eq(tasterEnquiry.id, id))
        .leftJoin(instruments, eq(tasterEnquiry.instrumentId, instruments.id))
        .limit(1);
      return res[0];
    }),
  edit: teacherProcedure
    .input(insertTasterEnquiryZodSchema)
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db
        .update(tasterEnquiry)
        .set({
          email: input.email,
          phone: input.phone,
          studentFirstName: input.studentFirstName,
          studentMiddleNames: input.studentMiddleNames,
          studentLastName: input.studentLastName,
          dob: input.dob,
          instrumentId: input.instrumentId,
          internalNotes: input.internalNotes,
          status: input.status,
        })
        .where(eq(tasterEnquiry.id, input.id))
        .returning();
      return res[0];
    }),
  findAvailableLessonSlots: teacherProcedure
    .input(
      z.object({
        instrumentId: z.string(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const teachersAndWorkingHours = await ctx.db
        .select()
        .from(instrumentsToTeachers)
        .where(eq(instrumentsToTeachers.instrumentId, input.instrumentId))
        .leftJoin(
          workingHours,
          eq(workingHours.teacherId, instrumentsToTeachers.teacherId),
        );

      const teachers = teachersAndWorkingHours.reduce(
        (acc, curr) => {
          const teacherId = curr.instruments_to_teachers.teacherId;
          const workingHours = acc[teacherId] ?? [];
          if (curr.workingHours) {
            workingHours.push({
              day: curr.workingHours.dayOfWeek,
              startTime: curr.workingHours.startTime,
              endTime: curr.workingHours.endTime,
            });
          }
          return {
            ...acc,
            [teacherId]: workingHours,
          };
        },
        {} as Record<
          string,
          { day: number; startTime: string; endTime: string }[]
        >,
      );

      const getTimeSlots = (startTime: string, endTime: string) => {
        const slots = [];
        let start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);

        while (start < end) {
          slots.push(start.toTimeString().substring(0, 5));
          start = new Date(start.getTime() + 30 * 60000); // Add 30 minutes
        }

        return slots;
      };

      const availableSlots = Object.keys(teachers).reduce(
        (acc, teacherId) => {
          const workingHours = teachers[teacherId];
          if (!workingHours) {
            return acc; // Skip if workingHours is undefined
          }

          const slotsByDay = workingHours.reduce(
            (dayAcc, wh) => {
              const slots = getTimeSlots(wh.startTime, wh.endTime);
              return {
                ...dayAcc,
                [wh.day]: (dayAcc[wh.day] ?? []).concat(slots),
              };
            },
            {} as Record<number, string[]>,
          );

          return {
            ...acc,
            [teacherId]: slotsByDay,
          };
        },
        {} as Record<string, Record<number, string[]>>,
      );

      console.log({ availableSlots });

      return availableSlots;
    }),
});
