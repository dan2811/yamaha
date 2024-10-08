"use client";
import Link from "next/link";
import React, { type ReactNode } from "react";

const NewClassesListLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between p-2">
          <h2 className="text-3xl font-bold">New Classes</h2>
          <Link
            className="rounded-lg bg-purple-500 p-2 text-white"
            href={`/admin/newClasses/create`}
          >
            + New Class
          </Link>
        </div>
        <div className="flex gap-2 rounded-lg border-4 border-purple-500 bg-purple-100/40 p-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default NewClassesListLayout;
