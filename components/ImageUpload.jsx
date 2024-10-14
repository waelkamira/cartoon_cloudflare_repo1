'use client';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import { inputsContext } from '../components/Context';

//? كيف تعمل
//? نقوم بالخطوات التالية next مع مشروع  cloudinary لربط
//? next-cloudinary تنصيب مكتبة
//? بهذا الشكل .ENV الخاصة بحسابي في cloud وضع اسم ال
//? NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dh2xlutfu"
//? unsigned و نضعه cloudinary على Preset نقوم بعمل
//? بهذا الشكل Preset وضع اسم ال
//? NEXT_PUBLIC_CLOUDINARY_Upload_preset_name = 'cooking';
//? import { CldUploadWidget } from 'next-cloudinary' نستورد

export default function ImageUpload({ image, style }) {
  const { dispatch, imageError } = useContext(inputsContext);
  // console.log('imageError', imageError);
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    setImageUrl(image);
  }, [image]);

  function handleSuccess(result) {
    setImageUrl(result?.info?.secure_url);
    if (style) {
      dispatch({ type: 'PROFILE_IMAGE', payload: result?.info?.secure_url });
    } else {
      dispatch({ type: 'IMAGE', payload: result?.info?.secure_url });
    }
  }

  return (
    <CldUploadWidget
      //?NEXT_PUBLIC_CLOUDINARY_Upload_preset_name='cooking' نضع
      uploadPreset="cooking"
      onSuccess={handleSuccess}
      //? عدد الصور التي يستطيع المستخدم تحميلها في المرة الواحدة
      options={{ maxFiles: 100 }}
    >
      {/* //? نقوم بانشاء دالة ترجع ديف يحتوي على صورة مثلا عند الضغط عليه يقوم
      //?المسؤولة عن فتح نافذة تحميل الصورة open باطلاق دالة تستدعي الدالة */}

      {({ open }) => {
        return (
          <div
            onClick={() => open?.()}
            className={
              style
                ? style
                : ' w-64 h-44 border-2 border-one cursor-pointer rounded-lg mt-4 overflow-hidden'
            }
          >
            {/* //? نريد عرض الصورة التي رفعناها في قلب الديف الذي رفعناها
            //?منه لذلك قمنا بانشاء حالة تحتوي على الرابط الراجع من السرفر 
            */}
            {imageError?.imageError && (
              <h1 className="text-one text-2xl text-center my-2 w-full animate-bounce font-bold">
                {imageError?.message}
              </h1>
            )}
            {!imageUrl && (
              <div className="flex flex-col justify-center items-center h-full">
                <MdOutlineAddPhotoAlternate className="text-one text-3xl z-50" />
                <h1 className="text-white font-bold m-2 text-lg">
                  {style ? '' : 'أضف صورة للطبخة'}
                </h1>
              </div>
            )}
            {(image ? image : imageUrl) && (
              <div className={style ? style : 'relative w-full h-44'}>
                <Image
                  priority
                  src={imageUrl}
                  layout="fill"
                  objectFit="cover"
                  alt="photo"
                />
              </div>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
}
