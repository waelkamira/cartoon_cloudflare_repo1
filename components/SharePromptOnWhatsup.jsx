'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const SharePrompt = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // إضافة الحدث لحذف "shared" عند إغلاق التطبيق
    const handleBeforeUnload = () => {
      localStorage.removeItem('shared');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    const timer = setTimeout(() => {
      const shared = localStorage.getItem('shared');
      if (!shared) {
        setShowModal(true);
        localStorage.setItem('shared', 'true');
      }
    }, 10000);

    // تنظيف المؤقت عند إلغاء تحميل المكون
    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      'جرب تطبيق "كرتون بهيجة أشرق لبن" الرائع لمشاهدة أفضل أفلام الكرتون القديم والحديث https://cartoon-cloudflare-repo4.pages.dev'
    )}`;

    if (navigator.share) {
      navigator
        .share({
          title: 'كرتون بهيجة',
          text: 'جرب تطبيق "كرتون بهيجة أشرق لبن" الرائع لمشاهدة أفضل أفلام الكرتون القديم والحديث',
          url: 'https://cartoon-cloudflare-repo4.pages.dev',
        })
        .then(() => {
          console.log('تمت المشاركة بنجاح');
          setShowModal(false); // إغلاق الرسالة عند المشاركة بنجاح
        })
        .catch((error) => {
          console.log('مشاركة ألغيت', error);
        });
    } else {
      window.open(whatsappUrl, '_blank');
      setShowModal(false); // إغلاق الرسالة بعد فتح رابط WhatsApp
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
                src="/windows11/Square44x44Logo.altform-unplated_targetsize-96.png"
                alt="App Icon"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <p>
              إذا أردت استخدام هذا التطبيق مجاناً عليك مشاركته على واتس اب مع
              أفراد العائلة والأصدقاء مع تحيات بهيجة أشرق لبن 😀 وجوزها نصوح
              الكوع ابن أبو رفسة المحترم
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
