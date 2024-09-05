import { z } from "zod";

// add any new roles to this array
// THE ORDER MATTERS, IT IS ASCENDING IN PERMISSIONS
export const roles = ["client", "teacher", "admin", "superAdmin"] as const;
export const zodRoles = z.enum(roles);
export type Role = z.infer<typeof zodRoles>;

export const bookTypes = ["course", "exam", "other"] as const;
export const zodBookTypes = z.enum(bookTypes);
export type BookType = z.infer<typeof zodBookTypes>;

export const lessonTypes = [
  "private",
  "semi-private",
  "class",
  "online",
] as const;
export const zodLessonTypes = z.enum(lessonTypes);
export type LessonType = z.infer<typeof zodLessonTypes>;

export const tasterStatuses = [
  "Awaiting customer action",
  "Awaiting admin action",
  "Booked",
  "Enrolled",
  "Cancelled",
  "Attended - failed to enrol",
] as const;
export const zodTasterStatuses = z.enum(tasterStatuses);
export type TasterStatus = z.infer<typeof zodTasterStatuses>;

export const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;
export const zodDays = z.enum(days);
export type Day = z.infer<typeof zodDays>;

export const attendanceValues = [
  "Attended",
  "Cancelled",
  "Late cancelled",
  "Did not attend",
  "We cancelled",
  "Moved",
] as const;
export const zodAttendanceValues = z.enum(attendanceValues);
export type AttendanceValues = z.infer<typeof zodAttendanceValues>;

export const paymentMethods = [
  "Card",
  "Cash",
  "Cheque",
  "Standing Order",
  "Other",
] as const;
export const zodPaymentMethods = z.enum(paymentMethods);
export type PaymentMethods = z.infer<typeof zodPaymentMethods>;

export interface GoogleProfile {
  aud: string;
  azp: string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  hd: string;
  iat: number;
  iss: string;
  jti: string;
  name: string;
  nbf: number;
  picture: string;
  sub: string;
}
