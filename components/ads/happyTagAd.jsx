'use client';
import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser';

const HtmlPage = ({ render = null }) => {
  const [htmlContent, setHtmlContent] = useState('');
  useEffect(() => {
    // دالة لتحميل السكريبت
    const loadScript = (src) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    };
    if (render !== null) {
      // تعيين مفتاح فريد لقيمة render
      const reloadKey = `render-${render}`;
      // تحقق مما إذا تم إعادة تحميل الصفحة مسبقًا لهذه القيمة
      const hasReloaded = sessionStorage.getItem(reloadKey);
      if (!hasReloaded) {
        // إذا لم يتم إعادة التحميل لهذه القيمة، قم بتعيين المفتاح وإعادة تحميل الصفحة
        sessionStorage.setItem(reloadKey, 'true');
        window.location.reload();
      } else {
        // إذا تم إعادة التحميل، قم بتحميل الإعلان مباشرة بعد التغيير
        //! قمنا بتفعيل منطقتي اعلان لنفس الاعلان, الاول يعرض على مشغل الفيديو والثاني في صفحة المسلسل او الاغنية عند التحميل الاول لكلا الاعلانين
        const htmlString =
          '<script async="async" data-cfasync="false" src="//thubanoa.com/1?z=8259372000"></script>';
        setHtmlContent(htmlString);
        loadScript('//thubanoa.com/1?z=8259372000');
      }
    } else {
      // قم بتحميل السكريبت الافتراضي عند عدم وجود render
      const htmlString =
        '<script async="async" data-cfasync="false" src="//thubanoa.com/1?z=8259389000"></script>';
      setHtmlContent(htmlString);
      loadScript('//thubanoa.com/1?z=8259389000');
    }
  }, [render]);
  // // return <div>{parse(htmlContent)}</div>;
};

export default HtmlPage;
