import { and, asc, eq, ilike, or } from "drizzle-orm";
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
  list: teacherProcedure
    .input(
      z.object({
        searchString: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const res = await ctx.db
        .select()
        .from(pupils)
        .orderBy(asc(pupils.fName), asc(pupils.lName))
        .where(
          or(
            and(
              eq(pupils.isDroppedOut, false),
              ilike(pupils.fName, `%${input.searchString}%`),
            ),
            and(
              eq(pupils.isDroppedOut, false),
              ilike(pupils.lName, `%${input.searchString}%`),
            ),
          ),
        );
      return res;
    }),
});
