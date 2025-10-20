"use client";
import React from "react";

const Loading = () => {
  return (
    <div className=" relative h-[90vh] overflow-hidden grid gap-4  grid-cols-1 lg:grid-cols-3 md:grid-col-2 items-center justify-center bg-white p-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="lg:h-[40vh] md:h-[33vh] h-[33vh] bg-gray-400/20 rounded-md animate-pulse p-4 space-y-4 flex flex-col "
        >
          <div className="bg-gray-300 h-full w-full rounded"></div>
          <div className="bg-gray-300 h-4 w-full rounded"></div>
          <div className="bg-gray-300 h-4 w-5/6 rounded"></div>
        </div>
      ))}
      <div className="w-16 h-16 border-8 border-red-500 border-dashed rounded-full animate-spin absolute lg:right-[48%] md:right-[48%] right-[42%] top-4/12"></div>
    </div>
  );
};

export default Loading;
