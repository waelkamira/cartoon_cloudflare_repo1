'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const SharePrompt = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // console.log('shared');

    const timer = setTimeout(() => {
      const shared = sessionStorage.getItem('shared');
      console.log('shared');
      if (!shared) {
        setShowModal(true);
        sessionStorage.setItem('shared', 'true');
        console.log('shared');
      }
    }, 10000);

    // تنظيف المؤقت عند إلغاء تحميل المكون
    return () => clearTimeout(timer);
  }, []);

  const handleShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      'جرب تطبيق "كرتون بهيجة" الرائع https://cartoon-cloudflare-repo4.pages.dev'
    )}`;

    if (navigator.share) {
      navigator
        .share({
          title: 'كرتون بهيجة',
          text: 'جرب تطبيق "كرتون بهيجة" الرائع لمشاهدة أفضل أفلام الكرتون',
          url: 'https://cartoon-cloudflare-repo4.pages.dev',
        })
        .then(() => {
          console.log('تمت المشاركة بنجاح');
          setShowModal(false);
        })
        .catch((error) => {
          console.log('مشاركة ألغيت', error);
        });
    } else {
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <>
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              maxWidth: '300px',
            }}
          >
            <div
              className="relative size-14 w-full"
              style={{ width: '96px', height: '96px', margin: '0 auto' }}
            >
              <Image
                src="/android/android-launchericon-96-96.png"
                alt="App Icon"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <p>
              إذا أردت استخدام هذا التطبيق مجاناً عليك مشاركته على واتس اب مع
              أفراد العائلة والأصدقاء مع تحيات بهيجة أشرق لبن 😀
            </p>
            <button
              onClick={handleShare}
              style={{
                backgroundColor: '#25D366',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                marginTop: '10px',
              }}
            >
              مشاركة
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SharePrompt;
