'use client';
import React from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import Image from 'next/image';

const SliderSection = ({ data, title, imageSrc, onSlideClick }) => {
  const [sliderRef] = useKeenSlider({
    loop: true,
    mode: 'free',
    slides: { perView: 3, spacing: 0 },
  });

  return (
    <div className="flex flex-col items-center justify-center my-4">
      <div className="relative h-32 w-72">
        <Image src={imageSrc} layout="fill" objectFit="cover" alt={title} />
      </div>
      <h1 className="w-full text-start px-2 text-white">{title}</h1>
      <div ref={sliderRef} className="keen-slider bg-two p-2 shadow-lg">
        {data.length === 0 ? (
          <div>Loading...</div>
        ) : (
          data.map((series, index) => (
            <div
              key={index}
              className="keen-slider__slide snap-center flex flex-col items-center justify-start px-2 w-full"
              onClick={() => onSlideClick(series)}
            >
              <div className="relative w-24 h-32 sm:w-36 sm:h-48 rounded-sm overflow-hidden mx-1 hover:cursor-pointer">
                <Image
                  src={series.seriesImage}
                  layout="fill"
                  objectFit="cover"
                  alt={series.seriesName}
                />
              </div>
              <h1 className="text-white text-center m-2 text-[10px] w-full line-clamp-2 font-bold">
                {series.seriesName}
              </h1>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SliderSection;
