// src/components/DashNavbar.tsx
"use client";

import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface DashNavbarProps {
  role: "super_admin" | "admin" | "rider" | "user";
}

const linksByRole: Record<string, { name: string; href: string }[]> = {
  super_admin: [
    { name: "Dashboard Home", href: "/dashboard/super_admin" },
    { name: "Add Client", href: "/dashboard/super_admin" },
    { name: "Manage Users", href: "/dashboard/super_admin/users" },
    { name: "Settings", href: "/dashboard/super_admin/settings" },
  ],
  admin: [
    { name: "Dashboard Home", href: "/dashboard/admin" },
    { name: "Orders", href: "/dashboard/admin/orders" },
    { name: "Products", href: "/dashboard/admin/products" },
  ],
  rider: [
    { name: "Dashboard Home", href: "/dashboard/rider" },
    { name: "My Deliveries", href: "/dashboard/rider/deliveries" },
  ],
  user: [
    { name: "Dashboard Home", href: "/dashboard/user" },
    { name: "My Orders", href: "/dashboard/user/orders" },
    { name: "Profile", href: "/dashboard/user/profile" },
  ],
};

export default function DashNavbar({ role }: DashNavbarProps) {
  const pathname = usePathname();
  const { user } = useUser();
  console.log(user);

  const links = linksByRole[role] || [];

  return (
    <nav className=" text-white p-4 flex space-x-4 ">
      <div className=" flex justify-between gap-2  items-center w-full">
        <div className=" flex-grow">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded ${
                  isActive ? "bg-blue-500 font-bold" : "hover:bg-gray-700"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
        <h1 >User Email:{user?.email}</h1>
      </div>
    </nav>
  );
}
