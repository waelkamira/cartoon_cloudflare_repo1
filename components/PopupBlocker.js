// components/PopupBlocker.js
'use client'; // تأكد من أن المكون عميل

import { useEffect } from 'react';

const PopupBlocker = () => {
  useEffect(() => {
    const originalOpen = window.open;

    // منع النوافذ المنبثقة
    window.open = function () {
      console.warn('Popup blocked.');
      return null;
    };

    // تنظيف السلوك الأصلي عند فك تركيب المكون
    return () => {
      window.open = originalOpen;
    };
  }, []);

  return null; // لا حاجة لعرض شيء من هذا المكون
};

export default PopupBlocker;
