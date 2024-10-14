import React, { useEffect } from 'react';

const AdScript = () => {
  useEffect(() => {
    // دالة لتحميل السكريبت
    const loadAdScript = () => {
      const script = document.createElement('script');
      script.src = 'https://shebudriftaiter.net/tag.min.js';
      script.setAttribute('data-zone', '8231850');
      document.body.appendChild(script);
    };

    // تحميل السكريبت عند تحميل الكمبوننت
    loadAdScript();

    return () => {
      // تنظيف السكريبت إذا لزم الأمر عند إزالة الكمبوننت
      const scriptElement = document.querySelector(
        'script[src="https://shebudriftaiter.net/tag.min.js"]'
      );
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
    };
  }, []);

  return null; // لا يوجد محتوى مرئي، الكمبوننت فقط لتحميل السكريبت
};

export default AdScript;
