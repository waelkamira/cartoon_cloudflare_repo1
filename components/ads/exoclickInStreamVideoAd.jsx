'use client';
import React, { useEffect, useRef } from 'react';

const ExoclickInStreamVideoAd = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    // تشغيل الفيديو بمجرد تحميل المكون
    if (videoElement) {
      videoElement.play().catch((error) => {
        console.error('Error playing the video:', error);
      });
    }
  }, []);

  return (
    <div style={{ width: '100%', height: 'auto' }}>
      <video
        ref={videoRef}
        controls
        autoPlay
        muted
        style={{ width: '100%', height: 'auto' }}
      >
        <source
          src="https://s.magsrv.com/v1/vast.php?idzone=5447624"
          type="video/mp4"
        />
        {/* الرسالة البديلة إذا لم يتمكن المتصفح من عرض الفيديو */}
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default ExoclickInStreamVideoAd;
