'use client';
import Image from 'next/image';
import React from 'react';
export default function CustomToast({
  t,
  message,
  emoji,
  greenEmoji,
  redEmoji,
}) {
  return (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white text-four shadow-lg rounded-lg pointer-events-auto flex-2 items-center justify-center p-4 mx-2 border`}
    >
      <div className="flex justify-between items-center my-1">
        <div className="flex-1 w-full">
          <div className="flex justify-center items-center gap-2">
            <div className="ml-3 flex-1">
              {/* <h1 className="text-sm">بهيجة اشرق لبن</h1> */}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div>
          <h1 className="sm:mt-4 text-[12px] sm:text-sm s:text-nowrap text-center  ">
            <span className="text-green-400 text-xl font-bold">
              {greenEmoji}
            </span>
            <span className="text-one text-xl mx-1 font-bold">{redEmoji}</span>

            {message}
            <span className="text-green-400 text-xl mx-1 font-bold">
              {emoji}
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
}
