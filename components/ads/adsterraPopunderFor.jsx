import Script from 'next/script';
import { useEffect } from 'react';

const AdComponent = () => {
  useEffect(() => {
    // تعديل الروابط لفتح الإعلان في نافذة جديدة دون الانتقال إليها
    const modifyLinks = () => {
      document.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', (event) => {
          event.preventDefault(); // منع الانتقال الافتراضي للرابط
          const href = link.getAttribute('href');
          if (href) {
            window.open(href, '_blank', 'noopener,noreferrer'); // فتح في نافذة جديدة دون تركيز النافذة الجديدة
          }
        });
      });
    };

    // استدعاء دالة تعديل الروابط بعد تحميل الإعلان
    window.onload = modifyLinks;

    return () => {
      window.onload = null; // تنظيف الحدث
    };
  }, []);

  return (
    <div className="">
      {/* استخدام مكون Script لتحميل السكربت بشكل غير متزامن */}
      <Script
        src="//pl24721906.cpmrevenuegate.com/eb/86/29/eb862969e99d642ce7537641857bdce0.js"
        strategy="lazyOnload" // تحميل السكربت بعد اكتمال تحميل الصفحة
        onLoad={() => {
          // console.log('Script loaded successfully');
        }}
      />
    </div>
  );
};

export default AdComponent;
