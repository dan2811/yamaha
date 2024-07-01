"use server";

import { and, count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import { classes, classesToPupils } from "~/server/db/schemas";
import type { Day, Role } from "~/server/types";

const checkForRole = async () => {
  const session = await getServerAuthSession();
  if (!session) throw new Error("Not authenticated");

  const allowedRoles: Role[] = ["teacher", "admin", "superAdmin"];
  if (!allowedRoles.includes(session.user.role))
    throw new Error("Not authorized");
};

export const deletePupilFromClass = async (
  classId: string,
  pupilId: string,
) => {
  await db
    .delete(classesToPupils)
    .where(
      and(
        eq(classesToPupils.classId, classId),
        eq(classesToPupils.pupilId, pupilId),
      ),
    );
  revalidatePath(`/admin/newClasses/${classId}`, "page");
};

export const addPupilToClass = async (classId: string, pupilId: string) => {
  await checkForRole();
  try {
    const pupilsInClass = await db
      .select()
      .from(classesToPupils)
      .where(eq(classesToPupils.classId, classId));

    const [classToModify] = await db
      .select()
      .from(classes)
      .where(eq(classes.id, classId));

    const maxPupils = classToModify?.maxPupils ?? 8;

    if (pupilsInClass.length >= maxPupils) {
      throw new Error("Class is full");
    }

    await db.insert(classesToPupils).values([{ classId, pupilId }]);
    revalidatePath(`/admin/newClasses/${classId}`, "page");
  } catch (e) {
    console.error(e);
    throw new Error("Failed to add pupil to class");
  }
};

export interface UpdateClassFormData {
  classId: string;
  startTime: string;
  startDate: string;
  day: string;
  regularTeacherId: string;
}

export const updateClass = async (formData: UpdateClassFormData) => {
  await checkForRole();

  const processedFormData = {
    ...formData,
    startTime: formData.startTime === "" ? undefined : formData.startTime,
    startDate: formData.startDate === "" ? undefined : formData.startDate,
  };

  try {
    await db
      .update(classes)
      .set({
        day: processedFormData.day,
        startTime: processedFormData.startTime,
        startDate: processedFormData.startDate,
        regularTeacherId: processedFormData.regularTeacherId,
      })
      .where(eq(classes.id, formData.classId));
  } catch (e) {
    console.error(e);
    throw new Error("Failed to update class");
  }
};
