"use client";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NavLink } from "./NavLink";
import logo from "@/assets/images/devDiaryLogo.png";
import SocialLink from "./SocialLink";

const Footer = () => {
  const pathname = usePathname();

  return (
    <footer className="bg-color-primary dark:bg-gray-900 text-gray-100 dark:text-gray-200 mt-10 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-3 gap-5 items-start  justify-betwee">
        {/* Logo Section */}
      <div className="flex flex-col space-y-3 col-span-2 md:col-span-1 row-span-1 row-start-1 mb-5">

          <Image
            src={logo}
            alt="devDiary Logo"
            width={50}
            height={50}
            className=" w-24 -ml-3"
          />
          <span className="text-2xl font-semibold text-color-secondary">
            DevDiary
          </span>
          <p className="text-sm text-gray-300 dark:text-gray-400 md:max-w-xs w-full  mt-3">
            A digital diary for developers — sharing code snippets, lessons, and
            progress to grow together in the tech journey.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="md: cols-span-1 row-span-1 md:row-start-1 row-start-2">
          <h2 className="text-lg font-bold mb-2 ml-3 ">Links</h2>
          <nav className="  grid grid-cols-2  gap-1 w-fit   ">
            {NavLink(pathname)}
          </nav>
        </div>

        {/* Social Links */}
        <div className=" md: cols-span-1 row-span-1 md:row-start-1 row-start-2  ml-aut">
          <h2 className="text-lg font-bold mb-2">Follow Me</h2>
          <div className="flex space-x-2  flex-col  gap-2">
           <SocialLink></SocialLink>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center mt-8 text-sm text-gray-400 dark:text-gray-400">
        © {new Date().getFullYear()} devDiary — All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
