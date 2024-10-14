'use client';
import Image from 'next/image';
import React from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import LoadingPhoto from './LoadingPhoto';

const photos = [
  {
    image: 'https://i.imgur.com/p7UQdQ8.png',
    number: 'number-slide2',
  },
  {
    image: 'https://i.imgur.com/EubV7nc.png',
    number: 'number-slide3',
  },
  {
    image: 'https://i.imgur.com/Aghx8tZ.png',
    number: 'number-slide1',
  },
  {
    image: 'https://i.imgur.com/1Ugllxw.png',
    number: 'number-slide4',
  },
  {
    image: 'https://i.imgur.com/4A2IYpJ.png',
    number: 'number-slide5',
  },
  {
    image: 'https://i.imgur.com/W7nzzPV.png',
    number: 'number-slide6',
  },
  {
    image: 'https://i.imgur.com/OY4UoU4.jpg',
    number: 'number-slide7',
  },
  {
    image: 'https://i.imgur.com/SOUJJ0O.png',
    number: 'number-slide8',
  },
  {
    image: 'https://i.imgur.com/1eD6a06.jpg',
    number: 'number-slide9',
  },
  {
    image: 'https://i.imgur.com/HOB8BHo.jpg',
    number: 'number-slide10',
  },
  {
    image: 'https://i.imgur.com/R7og6B0.jpg',
    number: 'number-slide11',
  },
  {
    image: 'https://i.imgur.com/VUUR6NK.png',
    number: 'number-slide12',
  },
  {
    image: 'https://i.imgur.com/tebUmkF.png',
    number: 'number-slide13',
  },
];

export default function Categories() {
  const [sliderRef] = useKeenSlider(
    {
      loop: true,
    },
    [
      (slider) => {
        let timeout;
        let mouseOver = false;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider?.next();
          }, 5000);
        }
        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on('dragStarted', clearNextTimeout);
        slider.on('animationEnded', nextTimeout);
        slider.on('updated', nextTimeout);
      },
    ]
  );
  return (
    <>
      <div
        ref={sliderRef}
        className="keen-slider size-44 sm:size-96 lg:size-[500px] clip-arc mt-[65px] sm:mt-[75px]"
      >
        {photos?.length > 0 &&
          photos?.map((item) => {
            return (
              <>
                <div className={`keen-slider__slide ` + ` ${item?.number}`}>
                  <div className="relative h-full w-full">
                    {item?.image ? (
                      <Image
                        src={item?.image}
                        layout="fill"
                        objectFit="cover"
                        objectPosition="top"
                        alt="photo"
                      />
                    ) : (
                      <LoadingPhoto />
                    )}
                  </div>
                </div>
              </>
            );
          })}
      </div>
    </>
  );
}
