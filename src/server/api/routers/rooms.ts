import { createTRPCRouter, teacherProcedure } from "../trpc";
import { rooms } from "~/server/db/schemas";
import { z } from "zod";

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
});
