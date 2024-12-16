import React from 'react';
import Button from './Button';

export default function LoginMessage({ setOpen }) {
  return (
    <div className="fixed right-0 h-screen w-full z-50 bg-white/60 px-4">
      <div className="text-white p-4 w-full h-64 bg-one rounded-md my-44">
        <h1 className="text-center my-8">
          يجب عليك تسجيل الدخول أولاً للمشاهدة
        </h1>
        <Button
          title={'تسجيل الدخول'}
          path={'/login'}
          style={'border border-white '}
          onClick={() => setOpen(false)}
        />
      </div>
    </div>
  );
}
