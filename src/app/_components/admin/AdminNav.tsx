"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const useActivePath = (): ((path: string) => boolean) => {
  const pathname = usePathname();
  const checkActivePath = (path: string) => {
    if (path === "/" && pathname !== path) {
      return false;
    }
    if (path === "/admin" && pathname !== path) {
      return false;
    }
    if (
      path.startsWith("/admin/register") &&
      pathname.startsWith("/admin/register")
    ) {
      return true;
    }
    return pathname.startsWith(path);
  };

  return checkActivePath;
};

export default function AdminNav() {
  const isActivePath = useActivePath();

  const adminNavRoutes = [
    {
      name: "Home",
      path: "/admin",
    },
    {
      name: "Tasters",
      path: "/admin/tasters",
    },
    {
      name: "Register",
      path: `/admin/register/${new Date().getDay()}`,
    },
    {
      name: "Settings",
      path: "/admin/settings",
    },
    {
      name: "Exit",
      path: "/",
    },
  ];

  return (
    <nav className="flex gap-6 bg-purple-700 px-6 py-2 text-white">
      {adminNavRoutes.map(({ name, path }) => (
        <Link
          key={name}
          className={`link ${isActivePath(path) ? "border-b-4 border-blue-500" : ""}`}
          href={path}
        >
          {name}
        </Link>
      ))}
    </nav>
  );
}
