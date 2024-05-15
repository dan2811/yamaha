import React from "react";
import type { TasterStatus } from "~/server/types";

const TasterStatus = ({
  status,
  showLabel,
}: {
  status: TasterStatus | "Error";
  showLabel?: boolean;
}) => {
  let color;
  let icon;

  switch (status) {
    case "Attended - failed to enrol":
      color = "bg-purple-500 text-white";
      icon = "🟣";
      break;
    case "Awaiting admin action":
      color = "bg-red-500 text-white";
      icon = "🔴";
      break;
    case "Awaiting customer action":
      color = "bg-blue-500 text-white";
      icon = "🔵";
      break;
    case "Booked":
      color = "bg-green-200 text-black";
      icon = "📅";
      break;
    case "Cancelled":
      color = "bg-grey-500 text-white";
      icon = "🔘";
      break;
    case "Enrolled":
      color = "bg-green-500 text-white";
      icon = "🟢";
      break;
    default:
      color = "bg-gray-500 text-white";
  }

  return (
    <p
      className={`rounded-full px-2 py-1 ${color} h-fit w-fit`}
      title={status.toUpperCase()}
    >
      {icon ?? status.toUpperCase()} {showLabel && status.toUpperCase()}
    </p>
  );
};

export default TasterStatus;
