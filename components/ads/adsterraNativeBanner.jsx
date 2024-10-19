'use client';
import React, { useEffect } from 'react';

const AdseraNativeBanner = () => {
  useEffect(() => {
    // إضافة سكربت الإعلان
    const script = document.createElement('script');
    script.src =
      '//pl24722007.cpmrevenuegate.com/f469ec57471c0a1740f3324b686039c0/invoke.js';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');

    document.body.appendChild(script);

    // تعديل سلوك الروابط بعد تحميل الإعلان
    script.onload = () => {
      document.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', (event) => {
          event.preventDefault(); // منع الانتقال الافتراضي للرابط
          const href = link.getAttribute('href');
          if (href) {
            window.open(href, '_blank', 'noopener,noreferrer'); // فتح في نافذة جديدة
          }
        });
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      id="container-f469ec57471c0a1740f3324b686039c0"
      className="ad-container"
      style={{ opacity: 1 }}
    ></div>
  );
};

export default AdseraNativeBanner;
