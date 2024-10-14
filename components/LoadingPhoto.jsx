'use client';
import { FaGear } from 'react-icons/fa6';

export default function LoadingPhoto() {
  return (
    <div className="flex items-center justify-center  rounded-full h-full">
      <FaGear className="animate-spin text-xl transition duration-300 text-gray-500" />
    </div>
  );
}
