"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { FaSpinner } from "react-icons/fa";
import defaultUserImage from "../assets/images/defaultUserWhite.webp";
import { UserRole } from "@/Interfaces/userInterfaces";

const AuthMenu: React.FC = () => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
console.log(sessionData)
  // 🔹 Loading state
  if (status === "loading") {
    return (
      <span className="animate-spin text-brandPrimary">
        <FaSpinner className="text-xl" />
      </span>
    );
  }
// 🔹 যদি user না থাকে → Login icon দেখাও
if (!sessionData?.user) {
  return (
    <Link
      href="/login"
      className="flex items-center justify-center hover:scale-95 text-brandPrimary font-semibold"
    >
      Login
    </Link>
  );
}

  // 🔹 যদি user থাকে → dropdown দেখাও
  const { name, image, role } = sessionData.user as {
    name?: string;
    image?: string;
    role?: UserRole;
  };
  console.log(name,image,role)

  // 🔹 Role অনুযায়ী dashboard link নির্ধারণ
  const getDashboardRoute = () => {
    switch (role) {
      case "super_admin":
        return "/dashboard/super_admin";
      case "admin":
        return "/dashboard/admin";
      case "rider":
        return "/dashboard/rider";
      case "user":
      default:
        return "/dashboard/user";
    }
  };

  return (
    <div className="dropdown dropdown-end">
      {/* 🔹 Avatar Button */}
      <div
        tabIndex={0}
        role="button"
        className="btn-circle avatar hover:scale-95 border border-brandPrimary"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden border border-brandPrimary">
          <Image
            src={image || defaultUserImage}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        </div>
      </div>

      {/* 🔹 Dropdown Content */}
      <ul
        tabIndex={0}
        className="mt-3 z-[1] p-2 font-semibold shadow menu menu-sm dropdown-content bg-white text-brandNeutral rounded-box w-52"
      >
        {/* User Info */}
        <li className="text-sm font-semibold px-2 py-1 uppercase border-b-2 border-gray-200">
          {name || "User"}
        </li>

        {/* Dashboard Access */}
        <li>
          <button
            onClick={() => router.push(getDashboardRoute())}
            className="text-left w-full hover:text-brandPrimary"
          >
            Dashboard
          </button>
        </li>

        {/* Logout */}
        <li>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-left w-full hover:text-brandPrimary"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AuthMenu;
