'use client';

import React, { useEffect } from 'react';

const HillTopAdsMultiTagBanner = ({ render }) => {
  useEffect(() => {
    // تعريف adScript خارج دالة loadAdScript للوصول إليه عند التفكيك
    let adScript;

    const loadAdScript = () => {
      if (!document.querySelector('.vast-blocker')) {
        adScript = document.createElement('script');
        adScript.async = true;
        adScript.src =
          '//scented-leather.com/b.XCVPsLdSGCln0/YhWpcL/leDmZ9nuLZaU/l-kkPBTnU/2/O-TJgt1bONTqITttN/TPYX5rOJDIUu5fMGwG';
        adScript.referrerPolicy = 'no-referrer-when-downgrade';

        document.body.appendChild(adScript);

        const runAd = () => {
          (window.adsbyexoclick = window.adsbyexoclick || []).push({});
          const vastBlocker = document.querySelector('.vast-blocker');
          if (vastBlocker) {
            vastBlocker.style.display = 'block';
            vastBlocker.style.width = '100%';
          }
        };

        const adLoadTimeout = setTimeout(runAd, 1000);

        return () => {
          clearTimeout(adLoadTimeout);
          if (document.body.contains(adScript)) {
            document.body.removeChild(adScript);
          }
        };
      }
    };

    // استدعاء دالة تحميل الإعلان مباشرة عند تحميل المكون
    loadAdScript();

    // تنظيف السكريبت عند تفكيك المكون
    return () => {
      if (adScript && document.body.contains(adScript)) {
        document.body.removeChild(adScript);
      }
    };
  }, [render]);

  return (
    <div
      id="ad-container"
      className="ad-container"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 'auto',
        padding: '10px',
      }}
    >
      <ins
        className="adsbyexoclick"
        data-zoneid="5449330"
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          maxWidth: '100%',
        }}
      ></ins>
    </div>
  );
};

export default HillTopAdsMultiTagBanner;
