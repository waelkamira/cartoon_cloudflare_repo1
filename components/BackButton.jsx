import Link from 'next/link';
import React from 'react';
import { TbArrowBigLeftLinesFilled } from 'react-icons/tb';

export default function BackButton() {
  return (
    <Link
      href={'/'}
      className="fixed bottom-4 sm:top-4 left-4 xl:top-12 xl:left-12 z-40"
    >
      <div className=" flex items-center justify-center rounded-lg overflow-hidden cursor-pointer xl:w-fit ">
        <TbArrowBigLeftLinesFilled className=" z-20 text-white text-2xl sm:text-4xl lg:text-[44px] animate-pulse transition-all duration-300  rounded-l-lg" />
        <TbArrowBigLeftLinesFilled className=" absolute -top-[4px] -left-[3px] z-10 text-gray-400 text-[33px] sm:text-4xl lg:text-[44px]  transition-all duration-300  rounded-l-lg" />
      </div>
      <h1 className="text-white xl:hidden">رجوع</h1>
    </Link>
  );
}
