import Link from "next/link";
import React from "react";
import AdminButton from "~/app/_components/admin/Button";

const AdminSettings = () => {
  return (
    <div>
      <AdminButton>
        <Link href="/admin/settings/users">Users</Link>
      </AdminButton>
      <AdminButton>
        <Link href="/admin/settings/staff">Staff</Link>
      </AdminButton>
      <AdminButton>
        <Link href="/admin/settings/rooms">Rooms</Link>
      </AdminButton>
      <AdminButton>
        <Link href="/admin/settings/openingHours">Opening Hours</Link>
      </AdminButton>
    </div>
  );
};

export default AdminSettings;
