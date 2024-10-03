import { clientProcedure, createTRPCRouter } from "../trpc";

export const userRouter = createTRPCRouter({
  getCurrentUser: clientProcedure
    .query(async ({ input, ctx }) => {
      return ctx.session.user;
    }),
});
