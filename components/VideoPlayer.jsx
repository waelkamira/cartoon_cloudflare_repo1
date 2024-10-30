'use client';

import React, { useState, useEffect, useRef } from 'react';
import LoadingPhoto from './LoadingPhoto';
import HappyTagAd from './ads/happyTagAd';

export default function VideoPlayer({
  videoUrl = ' ',
  image,
  movie,
  onNextEpisode, // إضافة prop جديد لدالة الانتقال للحلقة التالية
}) {
  const [videoSource, setVideoSource] = useState('');
  const [videoId, setVideoId] = useState('');
  const [aspectRatio, setAspectRatio] = useState(null);
  const [isAdPlaying, setIsAdPlaying] = useState(false); // حالة تتبع للإعلان
  const [adTimer, setAdTimer] = useState(null); // المؤقت لتشغيل الإعلان
  const videoRef = useRef(null);

  // console.log('videoUrl', videoUrl);
  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.code === 'Space') {
        event.preventDefault(); // منع التمرير عند الضغط على المسافة
        if (videoRef.current.paused) {
          videoRef.current.play(); // تشغيل الفيديو إذا كان متوقفًا
        } else {
          videoRef.current.pause(); // إيقاف الفيديو إذا كان مشغلاً
        }
      }
    };

    // إضافة مستمع للضغط على لوحة المفاتيح
    window.addEventListener('keydown', handleKeydown);

    // تنظيف المستمع عند تفكيك المكون
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  useEffect(() => {
    setVideoSource('');
    setVideoId('');

    const adjustedUrl = adjustVideoQuality(videoUrl);

    if (
      adjustedUrl.includes('youtube.com') ||
      adjustedUrl.includes('youtu.be')
    ) {
      // YouTube
      const videoIdMatch = adjustedUrl.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
      );
      if (videoIdMatch && videoIdMatch[1]) {
        setVideoSource('youtube');
        setVideoId(videoIdMatch[1]);
      }
    } else if (
      adjustedUrl.includes('cdn.arteenz.com') ||
      adjustedUrl.includes('ooanime')
    ) {
      setVideoSource('arteenz');
      setVideoId(adjustedUrl);
    } else if (
      adjustedUrl.includes('downet.net') ||
      adjustedUrl.includes('zidwish.site') ||
      movie === true
    ) {
      setVideoSource('zidwish');
      setVideoId(adjustedUrl);
    } else if (adjustedUrl.includes('dropbox.com')) {
      // Dropbox
      const directLink = adjustedUrl.replace('?dl=0', '?dl=1'); // تعديل الرابط إلى رابط مباشر
      setVideoSource('dropbox');
      setVideoId(directLink);
    } else {
      setVideoSource('otherSources');
      setVideoId(adjustedUrl);
    }

    // إعلان كل 30 دقيقة
    if (!adTimer) {
      const timer = setInterval(() => {
        setIsAdPlaying(true);
      }, 1800000);
      setAdTimer(timer);
    }

    return () => {
      if (adTimer) clearInterval(adTimer);
    };
  }, [videoUrl]);

  useEffect(() => {
    const iframe = videoRef.current;
    if (iframe) {
      const handleIframeClick = (event) => {
        event.preventDefault();
        // console.log('تم منع النقر على iframe');
      };
      iframe.addEventListener('click', handleIframeClick);

      return () => {
        iframe.removeEventListener('click', handleIframeClick);
      };
    }
  }, [videoRef]);

  const blockAdsAndPopups = () => {
    window.open = () => null; // منع فتح النوافذ الجديدة
  };

  useEffect(() => {
    blockAdsAndPopups();
  }, []);

  const handleAdEnd = () => {
    // بعد انتهاء الإعلان، نعيد تشغيل الفيلم الرئيسي
    setIsAdPlaying(false);
    videoRef.current.play(); // استئناف تشغيل الفيلم الرئيسي
  };

  const handleVideoEnd = () => {
    if (onNextEpisode) {
      onNextEpisode(); // الانتقال إلى الحلقة التالية
    } else {
      videoRef.current.play(); // إعادة تشغيل الفيديو
    }
  };

  const handleFullScreen = () => {
    // دالة لتفعيل وضع ملء الشاشة
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        // لأجهزة iOS/Safari
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.mozRequestFullScreen) {
        // لمتصفحات Firefox
        videoRef.current.mozRequestFullScreen();
      } else if (videoRef.current.msRequestFullscreen) {
        // لمتصفحات Internet Explorer/Edge
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  function adjustVideoQuality(url) {
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    let adjustedUrl = url;

    if (connection) {
      if (
        connection.effectiveType === '2g' ||
        connection.effectiveType === '3g'
      ) {
        adjustedUrl = url.replace('high', 'low');
      } else if (connection.effectiveType === '4g') {
        adjustedUrl = url.replace('high', 'medium');
      } else if (connection.effectiveType === '5g') {
        adjustedUrl = url;
      }
    }

    return adjustedUrl;
  }

  const updateAspectRatio = () => {
    const videoElement = videoRef.current;
    if (videoElement && videoElement.videoWidth && videoElement.videoHeight) {
      let ratio = videoElement.videoWidth / videoElement.videoHeight;
      setAspectRatio(ratio);
    }
  };

  return (
    <div
      className="relative w-full"
      style={{
        height: aspectRatio ? `calc(100vw / ${aspectRatio})` : 'auto',
      }}
    >
      {videoId ? (
        <div className="w-full">
          {/* <HappyTagAd /> */}
          {isAdPlaying ? (
            <div className="w-full h-full flex justify-center items-center">
              <video
                className="w-full min-w-72 min-h-44 sm:w-96 sm:h-72 md:w-[800px] md:h-[600px]"
                // src="//thubanoa.com/1?z=8259389" // رابط الإعلان
                autoPlay
                controls
                onEnded={handleAdEnd} // استئناف الفيلم بعد انتهاء الإعلان
              />
            </div>
          ) : (
            <>
              {videoSource === 'youtube' && (
                <div className="w-full h-full flex justify-center items-center">
                  <iframe
                    ref={videoRef}
                    className="w-full h-full min-h-72 sm:h-96 md:h-[500px] lg:h-[700px]"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                    allowFullScreen={true}
                    sandbox="allow-same-origin allow-scripts allow-forms"
                    title="YouTube Video Player"
                    onLoadedMetadata={updateAspectRatio}
                    onEnded={handleVideoEnd} // تحديث الصفحة عند انتهاء الفيديو
                    onDoubleClick={handleFullScreen}
                    loop
                  />
                </div>
              )}
              {videoSource === 'arteenz' && (
                <video
                  ref={videoRef}
                  className="w-full h-full"
                  style={{ width: '100%', height: '100%' }}
                  controls
                  poster={image}
                  controlsList="nodownload"
                  onLoadedMetadata={updateAspectRatio}
                  onContextMenu={(e) => e.preventDefault()}
                  referrerPolicy="no-referrer"
                  autoPlay
                  onEnded={handleVideoEnd}
                  onDoubleClick={handleFullScreen}
                >
                  <source src={`${videoId}?autoplay=0`} type="video/mp4" />
                </video>
              )}
              {videoSource === 'zidwish' && (
                <div className="w-full h-full flex justify-center items-center">
                  <iframe
                    ref={videoRef}
                    className="w-full min-w-72 min-h-44 sm:w-96 sm:h-72 md:w-[800px] md:h-[600px]"
                    src={`${videoId}?autoplay=1`}
                    allowFullScreen={true}
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-top-navigation"
                    title="Video Player"
                    onFocus={() => (document.body.style.overflow = 'hidden')}
                    onBlur={() => (document.body.style.overflow = 'auto')}
                    onEnded={handleVideoEnd}
                    onDoubleClick={handleFullScreen}
                  ></iframe>
                </div>
              )}
              {videoSource === 'otherSources' && (
                <video
                  ref={videoRef}
                  className="w-full h-[100%]"
                  style={{ width: '100%', height: '100%' }}
                  controls
                  poster={image}
                  controlsList="nodownload"
                  onLoadedMetadata={updateAspectRatio}
                  onContextMenu={(e) => e.preventDefault()}
                  referrerPolicy="no-referrer"
                  autoPlay
                  onEnded={handleVideoEnd}
                  onDoubleClick={handleFullScreen}
                >
                  <source src={`${videoId}?autoplay=1`} type="video/mp4" />
                </video>
              )}
              {videoSource === 'dropbox' && (
                <video
                  ref={videoRef}
                  className="w-full h-[100%]"
                  style={{ width: '100%', height: '100%' }}
                  controls
                  poster={image}
                  controlsList="nodownload"
                  onLoadedMetadata={updateAspectRatio}
                  onContextMenu={(e) => e.preventDefault()}
                  referrerPolicy="no-referrer"
                  autoPlay
                  onEnded={handleVideoEnd}
                  onDoubleClick={handleFullScreen}
                >
                  <source src={`${videoId}`} type="video/mp4" />
                </video>
              )}
            </>
          )}
        </div>
      ) : (
        <LoadingPhoto />
      )}
    </div>
  );
}
