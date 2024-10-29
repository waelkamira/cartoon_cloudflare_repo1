'use client';

import React, { useEffect } from 'react';

const ExoclickVideoSlider = () => {
  useEffect(() => {
    // إدراج سكريبت الإعلان الجديد عند تحميل المكون
    const adScript = document.createElement('script');
    adScript.async = true;
    adScript.type = 'application/javascript';
    adScript.src = 'https://a.magsrv.com/ad-provider.js';
    document.body.appendChild(adScript);

    // إضافة عنصر <ins> للإعلان
    const insElement = document.createElement('ins');
    insElement.className = 'eas6a97888e31';
    insElement.dataset.zoneid = '5449330';
    document
      .getElementById('outstream-video-ad-container')
      .appendChild(insElement);

    // تشغيل إعلان Exoclick
    (window.AdProvider = window.AdProvider || []).push({ serve: {} });

    // وظيفة لتشغيل الفيديو مرة واحدة فقط
    const playVideoOnce = (videoElement) => {
      if (videoElement && videoElement.paused) {
        videoElement.play().catch((error) => {
          console.error('Error playing the video:', error);
        });
      }
    };

    // وظيفة لتعيين الشفافية لكل فيديو
    const setVideoOpacity = () => {
      const videoElements = document.querySelectorAll(
        'video[id*="video_content_wrapper"]'
      ); // العثور على جميع الفيديوهات التي تحتوي على كلمة video في id
      videoElements.forEach((videoElement) => {
        videoElement.style.opacity = '0.5'; // تعيين الشفافية إلى 50%
      });
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
      setVideoOpacity(); // تعيين الشفافية عند تغيير DOM
    });

    // البدء بمراقبة DOM
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // تعيين الشفافية عند التحميل الأولي
    setVideoOpacity();

    // تشغيل الفيديو باستمرار حتى خارج الإطار
    observeVideoPlayback();

    // تنظيف المراقبة عند إزالة المكون
    return () => {
      observer.disconnect();
      document.body.removeChild(adScript); // إزالة السكريبت عند إزالة المكون
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

export default ExoclickVideoSlider;
