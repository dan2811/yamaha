import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="rounded-ful h-12 w-12 animate-pulse"></div>
    </div>
  );
};

export default LoadingSpinner;
