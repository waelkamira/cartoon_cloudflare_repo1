import { useEffect } from 'react';

const JuicyAdsVideo = () => {
  useEffect(() => {
    // تحميل سكربت JuicyAdsVideo عند تركيب المكون
    const script1 = document.createElement('script');
    script1.type = 'text/javascript';
    script1.async = true;
    script1.setAttribute('data-cfasync', 'false');
    script1.src = 'https://poweredby.jads.co/js/jads.js';

    const script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.async = true;
    script2.setAttribute('data-cfasync', 'false');
    script2.innerHTML =
      "(adsbyjuicy = window.adsbyjuicy || []).push({'adzone':1071638});";

    document.body.appendChild(script1);
    document.body.appendChild(script2);

    // تنظيف عند إلغاء التركيب
    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  return <ins id="1071638" data-width="308" data-height="298"></ins>;
};

export default JuicyAdsVideo;
