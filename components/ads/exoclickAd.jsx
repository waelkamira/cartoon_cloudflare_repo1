import Image from 'next/image';
import React from 'react';

const ExoClickAd = () => {
  if (typeof window !== 'undefined') {
    window.open = () => {
      return null;
    };
  }
  return (
    <a
      href="https://www.exoclick.com/signup/?login=wael177"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="relative w-40 h-60">
        <Image
          src="https://www.exoclick.com/banners/120x150.gif"
          alt="ExoClick Ad"
          border="0"
          fill
          objectFit="cover"
        />
      </div>
    </a>
  );
};

export default ExoClickAd;
