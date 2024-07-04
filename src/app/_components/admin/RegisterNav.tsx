"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const RegisterNav = ({ params: { day } }: { params: { day: string } }) => {
  const searchParams = useSearchParams();
  // function to change the path of the url whilst preserving current search params
  const createUrl = (newDay: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    return `${window.location.pathname.slice(0, window.location.pathname.length - 1)}/${newDay}?${newSearchParams.toString()}`;
  };

  return (
    <nav className="flex flex-col justify-evenly gap-2 sm:flex-row sm:text-lg md:text-xl lg:text-2xl">
      <Link
        href={createUrl("1")}
        className={`rounded-l-lg p-2 sm:rounded-none sm:rounded-t-lg ${day === "1" ? "bg-purple-500/20" : ""}`}
      >
        Monday
      </Link>
      <Link
        href={createUrl("2")}
        className={`rounded-t-lg p-2 sm:rounded-t-lg ${day === "2" ? "bg-purple-500/20" : ""}`}
      >
        Tuesday
      </Link>
      <Link
        href={createUrl("3")}
        className={`rounded-t-lg p-2 sm:rounded-t-lg ${day === "3" ? "bg-purple-500/20" : ""}`}
      >
        Wednesday
      </Link>
      <Link
        href={createUrl("4")}
        className={`rounded-t-lg p-2 sm:rounded-t-lg ${day === "4" ? "bg-purple-500/20" : ""}`}
      >
        Thursday
      </Link>
      <Link
        href={createUrl("5")}
        className={`rounded-t-lg p-2 sm:rounded-t-lg ${day === "5" ? "bg-purple-500/20" : ""}`}
      >
        Friday
      </Link>
      <Link
        href={createUrl("6")}
        className={`rounded-t-lg p-2 sm:rounded-t-lg ${day === "6" ? "bg-purple-500/20" : ""}`}
      >
        Saturday
      </Link>
      <Link
        href={createUrl("0")}
        className={`rounded-t-lg p-2 sm:rounded-t-lg ${day === "0" ? "bg-purple-500/20" : ""}`}
      >
        Sunday
      </Link>
    </nav>
  );
};

export default RegisterNav;
