import Link from 'next/link';
import React from 'react';

export default function Button({ style, title, onClick, path = '' }) {
  return (
    <Link href={path} className="w-full">
      <button
        type="submit"
        onClick={onClick}
        className={
          ' btn text-sm py-0.5 px-4 sm:text-lg sm:py-2 sm:px-8 my-2 text-white text-nowrap select-none rounded-full w-full max-h-12 hover:text-white shadow-lg hover:border-[#596067] '
        }
      >
        {title}
      </button>
    </Link>
  );
}
