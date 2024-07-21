/* eslint-disable drizzle/enforce-delete-with-where */
import { randomUUID } from "crypto";
import { db } from ".";
import { lessons, pupils } from "./schemas";
import { eq } from "drizzle-orm";

const main = async () => {
  const date = new Date().toISOString();

  console.log("inserting lesson with date: ", date);

  // const [lesson] = await db
  //   .insert(pupils)
  //   .values({
  //     dob: date,
  //     fName: "test",
  //     id: randomUUID(),
  //     lName: "test",
  //     isDroppedOut: false,
  //     isEnrolled: true,
  //     mNames: "yo",
  //     userId: "e007edc4-1d13-455e-aca5-1b0505b98076",
  //   })
  //   .returning();

  const [results] = await db.select().from(pupils).where(eq(pupils.dob, date));

  console.log("retrieved lesson date:  ", results?.dob);

  console.log("test complete!");
  process.exit(0);
};

await main();
