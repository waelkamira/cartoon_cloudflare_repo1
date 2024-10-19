import React, { useEffect } from 'react';

const ExoclickBanner = () => {
  useEffect(() => {
    // إضافة سكربت الأول بشكل غير متزامن
    const script1 = document.createElement('script');
    script1.src = 'https://a.magsrv.com/ad-provider.js';
    script1.async = true;
    script1.type = 'application/javascript';
    document.body.appendChild(script1);

    // إضافة عنصر <ins> الذي يتطلبه الإعلان
    const adElement = document.createElement('ins');
    adElement.className = 'eas6a97888e2';
    adElement.setAttribute('data-zoneid', '5446918');
    document.body.appendChild(adElement);

    // إضافة سكربت الثاني الذي يشغل الإعلان
    const script2 = document.createElement('script');
    script2.innerHTML =
      '(AdProvider = window.AdProvider || []).push({"serve": {}});';
    document.body.appendChild(script2);

    // تعيين الشفافية بعد تحميل الإعلان
    script2.onload = () => {
      const adElements = document.querySelectorAll('.exo-native-widget-item');
      adElements.forEach((el) => {
        el.style.opacity = '0.01'; // تعيين الشفافية بنسبة 50%
      });
    };

    // تنظيف السكربتات عند إزالة الكومبوننت
    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(adElement);
      document.body.removeChild(script2);
    };
  }, []);

  return (
    <div
      id="ad-container"
      className="ad bg-blue-400 p-4"
      style={{ opacity: 0.5 }}
    ></div>
  );
};

export default ExoclickBanner;
