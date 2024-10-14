import Link from 'next/link';
import React from 'react';
import Button from './Button';

export default function Element({ path, title, onClick }) {
  return (
    <Link href={path}>
      <Button
        onClick={onClick}
        title={title}
        style={
          'p-2 text-sm text-white text-nowrap bg-five hover:bg-one rounded-full hover:scale-[101%] my-3 w-full'
        }
      />
    </Link>
  );
}
