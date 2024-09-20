import { describe, it } from "node:test";
import { calculateAge } from "./dateHelpers";
import assert from "node:assert";

await describe("dateHelpers", async () => {
  await describe("calculateAge", async () => {
    await it("should return the correct age for a 25 year old", () => {
      const age = calculateAge(new Date("1999-01-01"));
      console.log(age);
      assert(age === 25);
    });
    await it("should return the correct age for a 10 year old", () => {
      const age = calculateAge(new Date("2014-01-01"));
      console.log(age);
      assert(age === 10);
    });
  });
});
