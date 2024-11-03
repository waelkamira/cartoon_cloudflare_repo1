'use client';
import React, { useEffect } from 'react';

const MonetagInPagePush = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://vemtoutcheeg.com/400/8454929';
    script.async = true;

    script.onerror = () => {
      console.error('Failed to load the ad script.');
    };

    script.onload = () => {
      console.log('Ad script loaded successfully.');
    };

    const appendScript = () => {
      try {
        (document.body || document.documentElement).appendChild(script);
      } catch (e) {
        console.error('Error appending script:', e);
      }
    };

    if (document.readyState === 'complete') {
      appendScript();
    } else {
      window.addEventListener('load', appendScript);
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      window.removeEventListener('load', appendScript);
    };
  }, []);

  return (
    <iframe
      className="transparent-iframe"
      style={{
        width: '100% !important',
        height: '170px !important',
        maxWidth: '320px !important',
        border: 'none !important',
        position: 'fixed !important',
        display: 'block !important',
        zIndex: '2147483647 !important',
        inset: '0px 0px auto auto !important',
        background: 'transparent !important',
        colorScheme: 'auto !important',
      }}
    ></iframe>
  );
};

export default MonetagInPagePush;
