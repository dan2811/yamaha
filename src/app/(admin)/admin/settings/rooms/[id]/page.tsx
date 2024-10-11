import AdminButton from "~/app/_components/admin/Button";
import React from "react";
import Link from "next/link";

const page = () => {
  return (
    <div>
      <p>Hello</p>
      <AdminButton>
        <Link href="/admin/settings/rooms/update">Update this room</Link>
      </AdminButton>
    </div>
  );
};

export default page;
