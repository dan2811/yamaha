import React, { type ComponentProps } from "react";

const AdminButton = (props: ComponentProps<"button">) => {
  return (
    <button
      {...props}
      className={`${props.className} rounded-lg bg-purple-500 p-2 text-white`}
    >
      {props.children}
    </button>
  );
};

export default AdminButton;
