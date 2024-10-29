'use client';
import React, { useEffect } from 'react';

const ExoclickOutStreamVideo = () => {
  useEffect(() => {
    // وظيفة لتشغيل الفيديو مرة واحدة فقط
    const playVideoOnce = (videoElement) => {
      if (videoElement && videoElement.paused) {
        videoElement.play().catch((error) => {
          console.error('Error playing the video:', error);
        });
      }
    };

    // مراقبة الفيديو
    const observeVideoPlayback = () => {
      const videoElements = document.querySelectorAll('video[class*="_video"]'); // العثور على جميع الفيديوهات التي تحتوي على _video في class
      videoElements.forEach((videoElement) => {
        playVideoOnce(videoElement); // تشغيل الفيديو مرة واحدة فقط عند العثور عليه
      });
    };

    // مراقبة DOM للحصول على الفيديو عند إضافته
    const observer = new MutationObserver(() => {
      observeVideoPlayback();
    });

    // البدء بمراقبة DOM
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // تشغيل الفيديو باستمرار حتى خارج الإطار
    observeVideoPlayback();

    // تنظيف المراقبة عند إزالة المكون
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      id="outstream-video-ad-container"
      className="outstream-video-ad-container"
    >
      {/* عنصر <ins> لإعلان outstream */}
      <ins
        className="eas6a97888e37"
        data-zoneid="5448580"
        id="outstream-video-ad"
        style={{ display: 'block', width: '100%', height: 'auto' }} // تحديد الأبعاد
      ></ins>
    </div>
  );
};

export default ExoclickOutStreamVideo;
// 'use client';
// import React, { useEffect } from 'react';

// const ExoclickOutStreamVideo = () => {
//   useEffect(() => {
//     // تحميل سكريبت AdProvider عبر خادم الوكيل لتجنب CORS
//     const adScript = document.createElement('script');
//     // توجيه الطلب عبر الوكيل المحلي لتجنب CORS
//     adScript.src = 'http://a.magsrv.com/ad-provider.js'; // استخدام الوكيل
//     adScript.async = true;
//     document.body.appendChild(adScript);

//     adScript.onload = () => {
//       // عند تحميل السكريبت بنجاح، تفعيل الإعلان
//       (window.AdProvider = window.AdProvider || []).push({ serve: {} });
//     };

//     return () => {
//       // تنظيف السكريبت عند إلغاء تحميل المكون
//       document.body.removeChild(adScript);
//     };
//   }, []);

//   return (
//     <div id="outstream-video-ad-container">
//       <ins className="eas6a97888e37" data-zoneid="5448580"></ins>
//     </div>
//   );
// };

// export default ExoclickOutStreamVideo;
