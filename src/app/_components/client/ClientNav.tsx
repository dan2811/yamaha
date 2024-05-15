"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { rolesAllowedToAdminPaths } from "~/middleware";

export default function ClientNav() {
  const pathname = usePathname();

  const adminNavRoutes = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Profile",
      path: "/profile",
    },
  ];

  const session = useSession();

  if (
    session.data &&
    rolesAllowedToAdminPaths.includes(session.data.user.role)
  ) {
    adminNavRoutes.push({
      name: "Admin console",
      path: "/admin",
    });
  }
  console.log(session);

  return (
    <nav className="flex gap-6 bg-gradient-to-b from-[#2e026d] to-[#15162c] py-2 text-white">
      {adminNavRoutes.map(({ name, path }) => (
        <Link
          key={name}
          className={`link ${pathname === path ? "border-b-4 border-blue-500" : ""}`}
          href={path}
        >
          {name}
        </Link>
      ))}
    </nav>
  );
}
