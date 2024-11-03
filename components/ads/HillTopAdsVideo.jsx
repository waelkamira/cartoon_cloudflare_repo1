'use client';
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-ads'; // استيراد مكتبة الإعلانات
import 'videojs-ima'; // استيراد مكتبة IMA

const VastAdComponent = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null); // مرجع لمشغل الفيديو

  useEffect(() => {
    // تحقق من أن الفيديو مرجعه غير فارغ ولم يتم تهيئة playerRef مسبقاً
    if (videoRef.current && !playerRef.current) {
      const player = videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        preload: 'auto',
      });

      playerRef.current = player; // حفظ مرجع player

      player.ima({
        adTagUrl:
          'https://unrealistic-reaction.com/d/m.F/zzdrGzNev/ZTGSU-/dejm/9/udZzUelVk/PSTlU/2SOdTPcIxvNVjJgbt/N/TSYS5WNTztEY2iOlQo', // ضع رابط إعلان VAST هنا
        debug: true, // خيار للتصحيح
      });

      player.on('readyforpreroll', () => {
        player.ima.requestAds(); // طلب الإعلانات
      });

      // تنظيف المشغل عند إلغاء المكون
      return () => {
        if (player) {
          player.dispose();
          playerRef.current = null;
        }
      };
    }
  }, []);

  return (
    <div>
      <video
        ref={videoRef}
        className="video-js vjs-default-skin"
        width="640"
        height="360"
        controls
      ></video>
    </div>
  );
};

export default VastAdComponent;
