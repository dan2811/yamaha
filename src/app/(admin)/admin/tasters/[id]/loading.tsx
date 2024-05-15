import React from "react";
import LoadingSpinner from "~/app/_components/admin/LoadingSpinner";

const Loading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <LoadingSpinner />
    </div>
  );
};

export default Loading;
