CREATE TABLE IF NOT EXISTS "attendance" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"pupilId" varchar(255) NOT NULL,
	"lessonId" varchar(255) NOT NULL,
	"value" varchar(50),
	"notes" varchar(255) DEFAULT '' NOT NULL,
	CONSTRAINT "attendance_lessonId_pupilId_unique" UNIQUE("lessonId","pupilId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "book" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" varchar(35),
	"price" numeric(3, 2) NOT NULL,
	"imageUrl" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "class_level" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "class_type" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"price" numeric(6, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "classes" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"startTime" time NOT NULL,
	"lengthInMins" integer NOT NULL,
	"endTime" time NOT NULL GENERATED ALWAYS AS ("classes"."startTime" + interval '1 minute' * "classes"."lengthInMins") STORED,
	"day" varchar NOT NULL,
	"maxPupils" integer NOT NULL,
	"startDate" date,
	"instrumentId" varchar(255),
	"bookId" varchar(255),
	"levelId" varchar(255),
	"regularTeacherId" varchar(255),
	"roomId" varchar(255),
	"typeId" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "classes_to_pupils" (
	"classId" varchar(255) NOT NULL,
	"pupilId" varchar(255) NOT NULL,
	CONSTRAINT "pk_classes_to_pupils" PRIMARY KEY("classId","pupilId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lessons" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"startTime" time NOT NULL,
	"lengthInMins" integer NOT NULL,
	"weCancelled" boolean NOT NULL,
	"endTime" time NOT NULL GENERATED ALWAYS AS ("lessons"."startTime" + interval '1 minute' * "lessons"."lengthInMins") STORED,
	"classId" varchar(255) NOT NULL,
	"roomId" varchar(255) NOT NULL,
	"teacherId" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "instrument" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "instruments_to_books" (
	"instrumentId" varchar(255) NOT NULL,
	"bookId" varchar(255) NOT NULL,
	CONSTRAINT "instruments_to_books_pk" PRIMARY KEY("bookId","instrumentId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "instruments_to_teachers" (
	"instrumentId" varchar(255) NOT NULL,
	"teacherId" varchar(255) NOT NULL,
	CONSTRAINT "instruments_to_teachers_pk" PRIMARY KEY("teacherId","instrumentId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pupil" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"fName" varchar(255) NOT NULL,
	"mNames" varchar(255),
	"lName" varchar(255) NOT NULL,
	"isDroppedOut" boolean DEFAULT false NOT NULL,
	"isEnrolled" boolean DEFAULT false NOT NULL,
	"dob" date NOT NULL,
	"userId" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "room" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"imageUrls" json
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rooms_to_instruments" (
	"roomId" varchar(255) NOT NULL,
	"instrumentId" varchar(255) NOT NULL,
	CONSTRAINT "rooms_to_instruments_pk" PRIMARY KEY("roomId","instrumentId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "taster_enquiry" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"studentFirstName" varchar(255) NOT NULL,
	"studentMiddleNames" varchar(255),
	"studentLastName" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(30) NOT NULL,
	"dob" date NOT NULL,
	"notes" text,
	"status" varchar NOT NULL,
	"internalNotes" varchar(600),
	"createdAt" varchar(100) DEFAULT '2024-10-09T18:15:37.726Z' NOT NULL,
	"instrumentId" varchar(255) NOT NULL,
	"lessonId" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teacher" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	CONSTRAINT "teacher_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workingHours" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"teacherId" varchar(255) NOT NULL,
	"day" varchar NOT NULL,
	"startTime" time NOT NULL,
	"endTime" time NOT NULL,
	CONSTRAINT "workingHours_teacherId_day_unique" UNIQUE("teacherId","day")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"userId" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"phone1" varchar(30),
	"phone2" varchar(30),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255),
	"role" varchar(35) DEFAULT 'client' NOT NULL,
	"droppedOut" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_to_children" (
	"userId" varchar(255) NOT NULL,
	"childId" varchar(255) NOT NULL,
	CONSTRAINT "users_to_children_pk" PRIMARY KEY("userId","childId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "openingHours" (
	"day" varchar PRIMARY KEY NOT NULL,
	"startTime" time NOT NULL,
	"endTime" time NOT NULL,
	CONSTRAINT "openingHours_day_unique" UNIQUE("day")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"paid" timestamp DEFAULT CURRENT_TIMESTAMP,
	"method" varchar(35) DEFAULT 'Card' NOT NULL,
	"amount_in_pennies" integer NOT NULL,
	"notes" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pupils_to_payments" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"pupil_id" varchar(255) NOT NULL,
	"payment_id" varchar(255) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attendance" ADD CONSTRAINT "attendance_pupilId_pupil_id_fk" FOREIGN KEY ("pupilId") REFERENCES "public"."pupil"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attendance" ADD CONSTRAINT "attendance_lessonId_lessons_id_fk" FOREIGN KEY ("lessonId") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "classes" ADD CONSTRAINT "classes_instrumentId_instrument_id_fk" FOREIGN KEY ("instrumentId") REFERENCES "public"."instrument"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "classes" ADD CONSTRAINT "classes_bookId_book_id_fk" FOREIGN KEY ("bookId") REFERENCES "public"."book"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "classes" ADD CONSTRAINT "classes_levelId_class_level_id_fk" FOREIGN KEY ("levelId") REFERENCES "public"."class_level"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "classes" ADD CONSTRAINT "classes_regularTeacherId_teacher_id_fk" FOREIGN KEY ("regularTeacherId") REFERENCES "public"."teacher"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "classes" ADD CONSTRAINT "classes_roomId_room_id_fk" FOREIGN KEY ("roomId") REFERENCES "public"."room"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "classes" ADD CONSTRAINT "classes_typeId_class_type_id_fk" FOREIGN KEY ("typeId") REFERENCES "public"."class_type"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "classes_to_pupils" ADD CONSTRAINT "classes_to_pupils_classId_classes_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "classes_to_pupils" ADD CONSTRAINT "classes_to_pupils_pupilId_pupil_id_fk" FOREIGN KEY ("pupilId") REFERENCES "public"."pupil"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lessons" ADD CONSTRAINT "lessons_classId_classes_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lessons" ADD CONSTRAINT "lessons_roomId_room_id_fk" FOREIGN KEY ("roomId") REFERENCES "public"."room"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lessons" ADD CONSTRAINT "lessons_teacherId_teacher_id_fk" FOREIGN KEY ("teacherId") REFERENCES "public"."teacher"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "instruments_to_books" ADD CONSTRAINT "instruments_to_books_instrumentId_instrument_id_fk" FOREIGN KEY ("instrumentId") REFERENCES "public"."instrument"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "instruments_to_books" ADD CONSTRAINT "instruments_to_books_bookId_book_id_fk" FOREIGN KEY ("bookId") REFERENCES "public"."book"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "instruments_to_teachers" ADD CONSTRAINT "instruments_to_teachers_instrumentId_instrument_id_fk" FOREIGN KEY ("instrumentId") REFERENCES "public"."instrument"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "instruments_to_teachers" ADD CONSTRAINT "instruments_to_teachers_teacherId_teacher_id_fk" FOREIGN KEY ("teacherId") REFERENCES "public"."teacher"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pupil" ADD CONSTRAINT "pupil_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rooms_to_instruments" ADD CONSTRAINT "rooms_to_instruments_roomId_room_id_fk" FOREIGN KEY ("roomId") REFERENCES "public"."room"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rooms_to_instruments" ADD CONSTRAINT "rooms_to_instruments_instrumentId_instrument_id_fk" FOREIGN KEY ("instrumentId") REFERENCES "public"."instrument"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taster_enquiry" ADD CONSTRAINT "taster_enquiry_instrumentId_instrument_id_fk" FOREIGN KEY ("instrumentId") REFERENCES "public"."instrument"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teacher" ADD CONSTRAINT "teacher_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workingHours" ADD CONSTRAINT "workingHours_teacherId_teacher_id_fk" FOREIGN KEY ("teacherId") REFERENCES "public"."teacher"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_children" ADD CONSTRAINT "users_to_children_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_children" ADD CONSTRAINT "users_to_children_childId_pupil_id_fk" FOREIGN KEY ("childId") REFERENCES "public"."pupil"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pupils_to_payments" ADD CONSTRAINT "pupils_to_payments_pupil_id_pupil_id_fk" FOREIGN KEY ("pupil_id") REFERENCES "public"."pupil"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pupils_to_payments" ADD CONSTRAINT "pupils_to_payments_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session" USING btree ("userId");