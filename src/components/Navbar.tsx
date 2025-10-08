"use client";

import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-3 px-6 flex justify-between items-center">
      {/* Logo */}
      <div className="text-xl font-bold text-blue-600">
        <Link href="/">MultiRest</Link>
      </div>

      {/* Nav Links */}
      <div className="flex space-x-6">
        <Link
          href="/"
          className="text-gray-700 hover:text-blue-600 transition-colors"
        >
          Home
        </Link>

        <Link
          href="/login"
          className="text-gray-700 hover:text-blue-600 transition-colors"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="text-gray-700 hover:text-blue-600 transition-colors"
        >
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
