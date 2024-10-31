'use client';
import React, { useEffect } from 'react';

const ExoclickOutStreamVideo = () => {
  useEffect(() => {
    // تشغيل الفيديو بشكل متكرر
    const playVideoContinuously = (videoElement) => {
      if (videoElement) {
        videoElement.loop = true; // تشغيل الفيديو بشكل متكرر
        videoElement.play().catch((error) => {
          console.error('Error playing the video:', error);
        });
      }
    };

    const observeVideoPlayback = () => {
      const videoElements = document.querySelectorAll('video[class*="_video"]');
      videoElements.forEach((videoElement) => {
        playVideoContinuously(videoElement);
      });
    };

    const observer = new MutationObserver(() => {
      observeVideoPlayback();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    observeVideoPlayback();

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      id="outstream-video-ad-container"
      className="outstream-video-ad-container"
    >
      <ins
        className="eas6a97888e37"
        data-zoneid="5448580"
        id="outstream-video-ad"
        style={{ display: 'block', width: '100%', height: 'auto' }}
      ></ins>
    </div>
  );
};

export default ExoclickOutStreamVideo;
