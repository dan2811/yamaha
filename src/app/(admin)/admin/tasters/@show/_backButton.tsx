"use client";
import { useRouter } from "next/navigation";
import React from "react";

const BackButton = ({
  label = "⬅ Back",
  returnPath,
}: {
  label?: string;
  returnPath?: string;
}) => {
  const router = useRouter();
  return (
    <button
      className="rounded-lg bg-purple-500 p-2 text-white"
      onClick={(e) => {
        returnPath ? router.push(returnPath) : router.back();
      }}
    >
      {label}
    </button>
  );
};

export default BackButton;
