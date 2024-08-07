import { createTRPCRouter, teacherProcedure } from "../trpc";
import { rooms } from "~/server/db/schemas";
import { z } from "zod";
import { randomUUID } from "crypto";

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
        })
    })
});
