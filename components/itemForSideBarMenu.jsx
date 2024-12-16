'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function ItemForSideBarMenu({
  planetName,
  planetImage,
  planetRoute,
}) {
  // console.log(planetName, planetImage, planetRoute);
  return (
    <div>
      <Link
        href={planetRoute}
        className="flex justify-start gap-2 items-center hover:shadow-lg hover:scale-105 rounded-lg"
      >
        <div className="relative h-14 w-16 my-1">
          <Image loading="lazy" src={planetImage} fill alt={'photo'} />
        </div>
        <h5 className="text-black text-sm">{planetName}</h5>
      </Link>
    </div>
  );
}
