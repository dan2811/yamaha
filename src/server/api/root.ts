import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { tasterRouter } from "./routers/taster";
import { instrumentRouter } from "./routers/instrument";
import { teacherRouter } from "./routers/teacher";
import { registerRouter } from "./routers/register";
import { classesRouter } from "./routers/classes";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  taster: tasterRouter,
  instrument: instrumentRouter,
  teacher: teacherRouter,
  register: registerRouter,
  classes: classesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
