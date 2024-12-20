import { createTRPCRouter, teacherProcedure } from "../trpc";
import { rooms, classes } from "~/server/db/schemas";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { TRPCError } from "@trpc/server";

export const roomsRouter = createTRPCRouter({
  list: teacherProcedure
    .input(
      z
        .object({
          instrumentId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const res = await ctx.db.select().from(rooms);
      return res;
    }),
  create: teacherProcedure
    .input(
      z
        .object({
          name: z.string(),
          description: z.string()
        })
    )
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db
        .insert(rooms)
        .values({
          name:input.name,
          description:input.description,
          id:randomUUID()
        }).returning();
      return res;
    }),
  update: teacherProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db
        .update(rooms)
        .set({
          name:input.name,
          description:input.description
        })
        .where(eq(rooms.id, input.id))
        .returning();
      return res;
    }),
  show: teacherProcedure
    .input(
      z.object({
        id: z.string()
      }),
    )
    .query(async ({ ctx, input }) => {
      const [res] = await ctx.db.select().from(rooms).where(eq(rooms.id, input.id)).limit(1);
      return res;
    }),
  delete: teacherProcedure
    .input(
      z.object({
        id: z.string()
      }),
    )
    .mutation( async ({ ctx, input }) => {
      const classesInRoom = await ctx.db.select().from(classes).where(eq(classes.roomId, input.id));
      if (classesInRoom.length === 0) {
        const res = await ctx.db
          .delete(rooms)
          .where(eq(rooms.id, input.id))
          .returning(); 
        return res;
      };
      throw new TRPCError ( {code: "CONFLICT", message: "You can't delete this room as there are classes scheduled."})
    }),
});
