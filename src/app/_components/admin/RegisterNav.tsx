"use client";
import Link from "next/link";
import React from "react";

const RegisterNav = ({ params: { day } }: { params: { day: string } }) => {
  return (
    <nav className="flex flex-col justify-evenly gap-2 sm:flex-row sm:text-lg md:text-xl lg:text-2xl">
      <Link
        href="/admin/register/1"
        className={`rounded-l-lg p-2 sm:rounded-none sm:rounded-t-lg ${day === "1" ? "bg-purple-500/20" : ""}`}
      >
        Monday
      </Link>
      <Link
        href="/admin/register/2"
        className={`rounded-t-lg p-2 sm:rounded-t-lg ${day === "2" ? "bg-purple-500/20" : ""}`}
      >
        Tuesday
      </Link>
      <Link
        href="/admin/register/3"
        className={`rounded-t-lg p-2 sm:rounded-t-lg ${day === "3" ? "bg-purple-500/20" : ""}`}
      >
        Wednesday
      </Link>
      <Link
        href="/admin/register/4"
        className={`rounded-t-lg p-2 sm:rounded-t-lg ${day === "4" ? "bg-purple-500/20" : ""}`}
      >
        Thursday
      </Link>
      <Link
        href="/admin/register/5"
        className={`rounded-t-lg p-2 sm:rounded-t-lg ${day === "5" ? "bg-purple-500/20" : ""}`}
      >
        Friday
      </Link>
      <Link
        href="/admin/register/6"
        className={`rounded-t-lg p-2 sm:rounded-t-lg ${day === "6" ? "bg-purple-500/20" : ""}`}
      >
        Saturday
      </Link>
      <Link
        href="/admin/register/0"
        className={`rounded-t-lg p-2 sm:rounded-t-lg ${day === "0" ? "bg-purple-500/20" : ""}`}
      >
        Sunday
      </Link>
    </nav>
  );
};

export default RegisterNav;
