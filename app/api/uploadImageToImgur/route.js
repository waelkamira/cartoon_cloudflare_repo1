import { NextResponse } from 'next/server';
import imgurClientManager from '../../../components/ImgurClientManager';
export const runtime = 'nodejs';

const cache = {
  data: new Map(), // لتخزين الصور مع روابطها
  lastUpdated: new Map(), // لتخزين وقت تحديث كل صورة
};

const CACHE_DURATION = 15 * 60 * 1000; // 15 دقيقة

function isCacheValid(fileKey) {
  const lastUpdated = cache.lastUpdated.get(fileKey);
  return lastUpdated && Date.now() - lastUpdated < CACHE_DURATION;
}

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('image');

  const fileKey = generateFileKey(file); // إنشاء مفتاح فريد للملف بناءً على خصائصه

  // التحقق مما إذا كان الملف موجود في الـ cache
  if (isCacheValid(fileKey)) {
    const cachedData = cache.data.get(fileKey);
    return NextResponse.json({ success: true, data: cachedData });
  }

  // Get the next available Client ID
  const clientId = imgurClientManager.getClientId();
  try {
    // رفع الصورة إلى Imgur
    const imgurResponse = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
      body: file,
    });

    const data = await imgurResponse.json();

    if (imgurResponse.ok) {
      // تعديل إعداد الخصوصية إلى Hidden
      const privacyResponse = await fetch(
        `https://api.imgur.com/3/image/${data.data.id}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Client-ID ${clientId}`,
          },
          body: JSON.stringify({ privacy: 'hidden' }),
        }
      );

      if (!privacyResponse.ok) {
        return NextResponse.json(
          { success: false, error: 'Failed to update image privacy settings.' },
          { status: 500 }
        );
      }

      // حفظ البيانات في الـ cache
      cache.data.set(fileKey, data.data);
      cache.lastUpdated.set(fileKey, Date.now());

      return NextResponse.json({ success: true, data: data.data });
    } else {
      return NextResponse.json(
        { success: false, error: data.data.error },
        { status: imgurResponse.status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// دالة لتوليد مفتاح فريد للملف بناءً على خصائصه
function generateFileKey(file) {
  return `${file.name}-${file.size}-${file.type}`;
}
