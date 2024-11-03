'use client';
import React, { useEffect } from 'react';

const JuicyAdsAd = () => {
  useEffect(() => {
    // إضافة السكريبت الأول
    const script1 = document.createElement('script');
    script1.type = 'text/javascript';
    script1.async = true;
    script1.setAttribute('data-cfasync', 'false');
    script1.src = 'https://poweredby.jads.co/js/jads.js';
    document.body.appendChild(script1);

    // إضافة السكريبت الثاني
    const script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.async = true;
    script2.setAttribute('data-cfasync', 'false');
    script2.innerHTML =
      "(adsbyjuicy = window.adsbyjuicy || []).push({'adzone':1071478});";
    document.body.appendChild(script2);

    // تنظيف السكريبتات عند إزالة المكون
    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  return (
    <div>
      {/* Placeholder for JuicyAds Ad */}
      <ins id="1071478" data-width="300" data-height="262"></ins>
    </div>
  );
};

export default JuicyAdsAd;
