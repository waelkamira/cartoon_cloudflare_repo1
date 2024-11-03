'use client';
import React, { useEffect } from 'react';

const HillTopAdsMultiTagBannerMobile = ({ render }) => {
  useEffect(() => {
    const script = document.createElement('script');
    const lastScript = document.scripts[document.scripts.length - 1];

    // إعدادات السكريبت
    script.settings = {};
    script.src =
      '//scented-leather.com/b/X-VXs.dIGolc0rYWWNd/icYZWC5/uSZyX/IK/PemmN9duYZlUHl/k/PlT/UE2/OJTDgD5aN/D/IYtBN/TPYS5ZOwDqkD0sMuw-';
    script.async = true;
    script.referrerPolicy = 'no-referrer-when-downgrade';

    // إدخال السكريبت في DOM
    lastScript.parentNode.insertBefore(script, lastScript);

    // تنظيف عند تفكيك المكون
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [render]);

  return null; // لا حاجة لإرجاع JSX لأن السكريبت يعمل في الخلفية فقط
};

export default HillTopAdsMultiTagBannerMobile;
