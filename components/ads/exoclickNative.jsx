'use client';
import React, { useEffect } from 'react';

const AdseraNativeBanner = () => {
  useEffect(() => {
    // إزالة target="_blank" من الروابط
    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
      link.removeAttribute('target');
    });

    // إضافة سكربت الإعلان الأول
    const adProviderScript = document.createElement('script');
    adProviderScript.src = 'https://a.magsrv.com/ad-provider.js';
    adProviderScript.async = true;
    document.body.appendChild(adProviderScript);

    // إنشاء عنصر الإعلان
    const adInsElement = document.createElement('ins');
    adInsElement.className = 'eas6a97888e20';
    adInsElement.setAttribute('data-zoneid', '5458470');
    document.body.appendChild(adInsElement);

    // تشغيل إعلان AdProvider
    adProviderScript.onload = () => {
      window.AdProvider = window.AdProvider || [];
      window.AdProvider.push({ serve: {} });
    };

    // إضافة السكربت الثاني للإعلان
    const secondScript = document.createElement('script');
    secondScript.src =
      '//pl24722007.cpmrevenuegate.com/f469ec57471c0a1740f3324b686039c0/invoke.js';
    secondScript.async = true;
    secondScript.setAttribute('data-cfasync', 'false');
    document.body.appendChild(secondScript);

    // تعديل سلوك الروابط بعد تحميل الإعلان
    secondScript.onload = () => {
      document.querySelectorAll('.ad-container a').forEach((link) => {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          const href = link.getAttribute('href');
          if (href) {
            window.open(href, '_blank', 'noopener,noreferrer');
          }
        });
      });
    };

    return () => {
      // تنظيف السكربتات والعناصر عند إلغاء تحميل المكون
      document.body.removeChild(adProviderScript);
      document.body.removeChild(secondScript);
      document.body.removeChild(adInsElement);
    };
  }, []);

  return (
    <div>
      <div
        id="container-f469ec57471c0a1740f3324b686039c0"
        className="ad-container"
        style={{ opacity: 1 }}
      ></div>
    </div>
  );
};

export default AdseraNativeBanner;
