import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-4 bg-gray-100 text-center text-sm text-gray-600 mt-10">
      <p>
        Developed by <span className="font-semibold">Shah Alom</span> &copy; {currentYear}. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
