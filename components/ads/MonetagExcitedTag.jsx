'use client';
import React, { useEffect } from 'react';

const HtmlPage = ({ render = null }) => {
  useEffect(() => {
    // دالة لتحميل السكربت
    const loadAdScript = (domain, zoneId) => {
      const script = document.createElement('script');
      script.src = `https://${domain}/401/${zoneId}`;
      script.async = true;
      script.setAttribute('data-cfasync', 'false');

      // محاولة إرفاق السكربت إلى الـ DOM
      try {
        (document.body || document.documentElement).appendChild(script);
      } catch (e) {
        console.error('Error appending ad script:', e);
      }

      // تنظيف السكربت عند إلغاء تحميل المكون
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    };

    // منطق التعامل مع render لتحديد أي سكربت يتم تحميله
    if (render !== null) {
      // توليد مفتاح فريد لقيمة render
      const reloadKey = `render-${render}`;
      const hasReloaded = sessionStorage.getItem(reloadKey);

      if (!hasReloaded) {
        // إعادة تحميل الصفحة إذا لم تتم إعادة التحميل لهذه القيمة مسبقًا
        sessionStorage.setItem(reloadKey, 'true');
        window.location.reload();
      } else {
        // تحميل الإعلان عند إعادة التحميل
        loadAdScript('thubanoa.com', '825937200');
      }
    } else {
      // تحميل السكربت الافتراضي إذا لم يتم تحديد render
      loadAdScript('thubanoa.com', '825938900');
    }
  }, [render]);

  return null; // لا يوجد محتوى للعرض
};

export default HtmlPage;
