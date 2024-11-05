'use client';
import React, { useEffect } from 'react';

const AdIframe = () => {
  useEffect(() => {
    // تغيير شفافية العناصر بعد تحميل المكون
    document.querySelectorAll("div[id^='atContainer']").forEach((element) => {
      element.style.opacity = '0.5'; // اجعل الشفافية 50%
    });

    // Script to set the atOptions
    const script1 = document.createElement('script');
    script1.type = 'text/javascript';
    script1.innerHTML = `
      atOptions = {
        key: '46a3b7919cc55172c06a3175cc25a2d6',
        format: 'iframe',
        height: 300,
        width: 160,
        params: {}
      };
    `;
    document.body.appendChild(script1);

    // Script to load the ad
    const script2 = document.createElement('script');
    script2.src =
      '//www.topcpmcreativeformat.com/46a3b7919cc55172c06a3175cc25a2d6/invoke.js';
    script2.type = 'text/javascript';
    script2.async = true;

    document.body.appendChild(script2);

    // تنظيف بعد إزالة المكون
    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  return (
    <div style={{ width: 160, height: 300, opacity: 0.5 }} className="absolute">
      {/* Placeholder for the ad iframe */}
      <div
        id="ad-container"
        style={{ width: 160, height: 300, opacity: 0.5 }}
      />
    </div>
  );
};

export default AdIframe;
