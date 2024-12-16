'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { TbArrowBigLeftLinesFilled } from 'react-icons/tb';

export default function BackButton() {
  const router = useRouter();
  const path = usePathname();
  // console.log('path', path);
  return (
    <>
      {path === '/' ? (
        ''
      ) : (
        <div
          className="fixed bottom-4 sm:top-4 left-4 xl:top-32 xl:left-12 z-50 cursor-pointer"
          onClick={() => router.push('/')}
        >
          <div className="flex items-center justify-center rounded-lg overflow-hidden cursor-pointer xl:w-fit z-50">
            <TbArrowBigLeftLinesFilled className=" z-20 text-white text-2xl sm:text-4xl lg:text-[44px] animate-pulse transition-all duration-300  rounded-l-lg cursor-pointer" />
            <TbArrowBigLeftLinesFilled className=" absolute -top-[4px] -left-[3px] z-10 text-gray-400 text-[33px] sm:text-4xl lg:text-[44px]  transition-all duration-300  rounded-l-lg cursor-pointer" />
          </div>
          <h1 className="text-white cursor-pointer">رجوع</h1>
        </div>
      )}
    </>
  );
}
