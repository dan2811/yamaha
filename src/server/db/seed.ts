/* eslint-disable drizzle/enforce-delete-with-where */
import { randomUUID } from "crypto";
import { db } from ".";
import {
  classLevel,
  classType,
  classes,
  classesToPupils,
  instruments,
  instrumentsToTeachers,
  lessons,
  pupils,
  rooms,
  roomsToInstruments,
  teacher,
  users,
  usersToChildren,
} from "./schemas";
import type { InferSelectModel } from "drizzle-orm";
import { Infer } from "next/dist/compiled/superstruct";

const userData = {
  gail: {
    name: "Gail",
    email: "gail@derbyyms.co.uk",
  },
  david: {
    name: "David",
    email: "david@derbyyms.co.uk",
  },
  kev: {
    name: "Kev",
    email: "kev@derbyyms.co.uk",
  },
};

const insertRooms = async () => {
  return db
    .insert(rooms)
    .values([
      {
        id: randomUUID(),
        name: "Room 1",
        description: "Has 8 guitars and a PA system",
      },
      {
        id: randomUUID(),
        name: "Room 2",
        description: "Has 8 keyboards",
      },
      {
        id: randomUUID(),
        name: "Room 3",
        description: "Has 3 Drumkits and 8 practice pads",
      },
    ])
    .returning();
};

const insertUsers = async () => {
  return db
    .insert(users)
    .values([
      {
        id: randomUUID(),
        name: "Dan Jordan",
        email: "djordandrums@gmail.com",
        role: "superAdmin",
      },
      {
        id: randomUUID(),
        role: "teacher",
        ...userData.david,
      },
      {
        id: randomUUID(),
        role: "superAdmin",
        ...userData.gail,
      },
      {
        id: randomUUID(),
        email: "reception@derbyyms.co.uk",
        name: "Receptionist",
        role: "admin",
      },
      {
        id: randomUUID(),
        role: "teacher",
        ...userData.kev,
      },
    ])
    .returning();
};

const insertInstruments = async (
  createdRooms: InferSelectModel<typeof rooms>[],
) => {
  //make sure there are always more instruments that rooms.
  const createdInstruments = await db
    .insert(instruments)
    .values([
      {
        id: randomUUID(),
        name: "Guitar",
      },
      {
        id: randomUUID(),
        name: "Drums",
      },
      {
        id: randomUUID(),
        name: "Keyboard",
      },
      {
        id: randomUUID(),
        name: "Piano",
      },
    ])
    .returning();

  if (createdInstruments.length > createdRooms.length) {
    const roomToInstrumentsRelations = createdRooms.map((room, idx) => ({
      roomId: room.id,
      instrumentId: createdInstruments[idx]!.id,
    }));
    console.log(roomToInstrumentsRelations);
    await db.insert(roomsToInstruments).values(roomToInstrumentsRelations);
  } else {
    console.warn(
      "There are more rooms than instruments, cannot create relations!!",
    );
  }
  return createdInstruments;
};

const insertTeachers = async ({
  createdUsers,
  createdInstruments,
}: {
  createdUsers: InferSelectModel<typeof users>[];
  createdInstruments: InferSelectModel<typeof instruments>[];
}) => {
  const createdTeachers = await db
    .insert(teacher)
    .values([
      {
        id: randomUUID(),
        userId: createdUsers.find(
          (user) => user.email === userData.david.email,
        )!.id,
      },
      {
        id: randomUUID(),
        userId: createdUsers.find((user) => user.email === userData.gail.email)!
          .id,
      },
      {
        id: randomUUID(),
        userId: createdUsers.find((user) => user.email === userData.kev.email)!
          .id,
      },
    ])
    .returning();

  await db.insert(instrumentsToTeachers).values([
    {
      instrumentId: createdInstruments.find((instr) => instr.name === "Drums")!
        .id,
      teacherId: createdTeachers.find(
        (teacher) =>
          teacher.userId ===
          createdUsers.find((user) => user.email === userData.david.email)!.id,
      )!.id,
    },
    {
      instrumentId: createdInstruments.find((instr) => instr.name === "Guitar")!
        .id,
      teacherId: createdTeachers.find(
        (teacher) =>
          teacher.userId ===
          createdUsers.find((user) => user.email === userData.kev.email)!.id,
      )!.id,
    },
    {
      instrumentId: createdInstruments.find(
        (instr) => instr.name === "Keyboard",
      )!.id,
      teacherId: createdTeachers.find(
        (teacher) =>
          teacher.userId ===
          createdUsers.find((user) => user.email === userData.gail.email)!.id,
      )!.id,
    },
    {
      instrumentId: createdInstruments.find((instr) => instr.name === "Piano")!
        .id,
      teacherId: createdTeachers.find(
        (teacher) =>
          teacher.userId ===
          createdUsers.find((user) => user.email === userData.gail.email)!.id,
      )!.id,
    },
  ]);

  return createdTeachers;
};

const insertParents = async () => {
  return await db
    .insert(users)
    .values([
      {
        id: randomUUID(),
        name: "Chris Barker",
        email: "parent1@derbyyms.co.uk",
        role: "client",
        phone1: "0123456789",
      },
      {
        id: randomUUID(),
        name: "Angela Caborn",
        email: "parent2@derbyyms.co.uk",
        role: "client",
        phone1: "0123456789",
      },
      {
        id: randomUUID(),
        name: "Lee Jordan",
        email: "parent3@derbyyms.co.uk",
        role: "client",
        phone1: "0123456789",
      },
    ])
    .returning();
};

const insertPupils = async ({
  parents,
  createdUsers,
}: {
  parents: InferSelectModel<typeof users>[];
  createdUsers: InferSelectModel<typeof users>[];
}) => {
  const createdPupils = await db
    .insert(pupils)
    .values([
      {
        id: randomUUID(),
        fName: "Daniel",
        mNames: "Lee",
        lName: "Jordan",
        dob: new Date("1994-11-28").toDateString(),
        userId: createdUsers.find(
          (usr) => usr.email === "djordandrums@gmail.com",
        )!.id,
      },
      {
        id: randomUUID(),
        fName: "Lily",
        mNames: "Rachael",
        lName: "Barker",
        dob: new Date("1990-10-28").toDateString(),
      },
      {
        id: randomUUID(),
        fName: "Robert",
        mNames: "Gary",
        lName: "Scottorn",
        dob: new Date("1994-11-28").toDateString(),
      },
    ])
    .returning();

  await db.insert(usersToChildren).values([
    {
      childId: createdPupils.find((pupil) => pupil.fName === "Lily")!.id,
      userId: parents.find((parent) => parent.name === "Chris Barker")!.id,
    },
    {
      childId: createdPupils.find((pupil) => pupil.fName === "Robert")!.id,
      userId: parents.find((parent) => parent.name === "Chris Barker")!.id,
    },
    {
      childId: createdPupils.find((pupil) => pupil.fName === "Daniel")!.id,
      userId: parents.find((parent) => parent.name === "Angela Caborn")!.id,
    },
    {
      childId: createdPupils.find((pupil) => pupil.fName === "Daniel")!.id,
      userId: parents.find((parent) => parent.name === "Lee Jordan")!.id,
    },
  ]);

  return createdPupils;
};

const insertClassTypes = async () => {
  await db
    .insert(classType)
    .values([
      {
        id: randomUUID(),
        name: "Class",
        price: "42.62",
        description: "Class lessons are great",
      },
      {
        id: randomUUID(),
        name: "Private",
        price: "62.62",
        description: "Private lessons are rubbish",
      },
      {
        id: randomUUID(),
        name: "Semi-Private",
        price: "50.62",
        description: "Semi-Private lessons are alright",
      },
      {
        id: randomUUID(),
        name: "Online-Private",
        price: "50.62",
        description: "Online private lessons are ok",
      },
    ])
    .returning();
};

const insertClasses = async ({
  createdInstruments,
  createdRooms,
  createdTeachers,
  createdUsers,
}: {
  createdInstruments: InferSelectModel<typeof instruments>[];
  createdRooms: InferSelectModel<typeof rooms>[];
  createdTeachers: InferSelectModel<typeof teacher>[];
  createdUsers: InferSelectModel<typeof users>[];
}) => {
  return await db
    .insert(classes)
    .values([
      {
        id: randomUUID(),
        day: "Monday",
        lengthInMins: 60,
        startTime: "16:00",
        maxPupils: 8,
        instrumentId: createdInstruments.find(
          (instr) => instr.name === "Drums",
        )!.id,

        roomId: createdRooms.find((room) => room.name === "Room 3")!.id,
        regularTeacherId: createdTeachers.find(
          (teacher) =>
            teacher.userId ===
            createdUsers.find((user) => user.email === userData.david.email)!
              .id,
        )!.id,
      },
    ])
    .returning();
};

// const insertLessons = async ({
//   createdClasses,
// }: {
//   createdClasses: InferSelectModel<typeof classes>[];
// }) => {
//   await Promise.all(
//     createdClasses.map(async (c) => {
//       await db.insert(lessons).values({
//         id: randomUUID(),
//         date: new Date(),
//         classId: c.id,
//         lengthInMins: c.lengthInMins,
//         roomId: c.roomId,
//         startTime: c.startTime,
//         teacherId: c.regularTeacherId,
//       });
//     }),
//   );
// };

const insertClassesToPupils = async ({
  createdClasses,
  createdPupils,
}: {
  createdClasses: InferSelectModel<typeof classes>[];
  createdPupils: InferSelectModel<typeof pupils>[];
}) => {
  await db.insert(classesToPupils).values([
    {
      classId: createdClasses[0]!.id,
      pupilId: createdPupils[0]!.id,
    },
    {
      classId: createdClasses[0]!.id,
      pupilId: createdPupils[1]!.id,
    },
    {
      classId: createdClasses[0]!.id,
      pupilId: createdPupils[2]!.id,
    },
  ]);
};

const insertClassLevels = async () => {
  await db.insert(classLevel).values([
    {
      name: "Debut",
      description: "Debut level",
    },
    {
      name: "Grade 1",
      description: "Grade 1 level",
    },
    {
      name: "Grade 2",
      description: "Grade 2 level",
    },
    {
      name: "Grade 3",
      description: "Grade 3 level",
    },
    {
      name: "Grade 4",
      description: "Grade 4 level",
    },
    {
      name: "Grade 5",
      description: "Grade 5 level",
    },
    {
      name: "Grade 6",
      description: "Grade 6 level",
    },
    {
      name: "Grade 7",
      description: "Grade 7 level",
    },
    {
      name: "Grade 8",
      description: "Grade 8 level",
    },
  ]);
};

const main = async () => {
  await db.delete(lessons);
  await db.delete(rooms);
  await db.delete(users);
  await db.delete(instruments);
  await db.delete(teacher);
  await db.delete(pupils);
  await db.delete(classType);
  await db.delete(classes);
  await db.delete(classesToPupils);
  await db.delete(classLevel);
  const createdRooms = await insertRooms();
  const createdUsers = await insertUsers();
  const createdInstruments = await insertInstruments(createdRooms);
  const createdTeachers = await insertTeachers({
    createdUsers,
    createdInstruments,
  });
  const parents = await insertParents();
  const createdPupils = await insertPupils({ parents, createdUsers });
  const classTypes = await insertClassTypes();
  const createdClasses = await insertClasses({
    createdInstruments,
    createdRooms,
    createdTeachers,
    createdUsers,
  });
  const createdClassesToPupils = await insertClassesToPupils({
    createdClasses,
    createdPupils,
  });
  const createdClassLevels = await insertClassLevels();

  // const createdLessons = await insertLessons({ createdClasses });

  console.log("Seed complete!");
  process.exit(0);
};

await main();
