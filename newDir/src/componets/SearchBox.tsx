'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IoSearchSharp } from "react-icons/io5";

const SearchBox = () => {
  const [value, setValue] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    router.push(`/search?query=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="flex items-center border border-red-500 rounded-lg overflow-hidden bg-white w-full ">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search..."
          className=" px-2  py-1 text-gray-800 outline-none flex-1  w-full "
        />
        <button
          type="submit"
          className="bg-red-500 text-white px-2 py-2 hover:bg-red-600 w-2/12 rounded-r-md h-full text-xl transition duration-200 flex justify-center items-center"
        >
        <IoSearchSharp />
        </button>
      </div>
    </form>
  );
};


export default SearchBox;