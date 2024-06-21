import { eq } from "drizzle-orm";
import { createTRPCRouter, teacherProcedure } from "../trpc";
import { pupils } from "~/server/db/schemas";
import { z } from "zod";

export const pupilsRouter = createTRPCRouter({
  show: teacherProcedure
    .input(
      z.object({
        pupilId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const res = await ctx.db
        .select()
        .from(pupils)
        .where(eq(pupils.id, input.pupilId));
      return res[0];
    }),
});
