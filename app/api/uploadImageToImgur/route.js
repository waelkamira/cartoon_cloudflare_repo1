import { NextResponse } from 'next/server';
import imgurClientManager from '../../../components/ImgurClientManager';
export const runtime = 'edge';
const cache = {
  data: new Map(), // لتخزين الصور مع روابطها
  lastUpdated: new Map(), // لتخزين وقت تحديث كل صورة
};

const CACHE_DURATION = 15 * 60 * 1000; // 15 دقيقة

function isCacheValid(imageHash) {
  const lastUpdated = cache.lastUpdated.get(imageHash);
  return lastUpdated && Date.now() - lastUpdated < CACHE_DURATION;
}

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('image');

  const fileHash = await hashFile(file); // نقوم بإنشاء hash للملف لتحديده بشكل فريد
  // التحقق مما إذا كان الملف موجود في الـ cache
  if (isCacheValid(fileHash)) {
    const cachedData = cache.data.get(fileHash);
    return NextResponse.json({ success: true, data: cachedData });
  }

  // Get the next available Client ID
  const clientId = imgurClientManager.getClientId();
  try {
    const imgurResponse = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
      body: file,
    });

    const data = await imgurResponse.json();

    if (imgurResponse.ok) {
      // حفظ البيانات في الـ cache
      cache.data.set(fileHash, data.data);
      cache.lastUpdated.set(fileHash, Date.now());

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

// دالة لتوليد hash من الملف
async function hashFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// import { NextResponse } from 'next/server';
// import imgurClientManager from '../../../components/ImgurClientManager';

// export async function POST(req) {
//   const formData = await req.formData();
//   const file = formData.get('image');

//   // Get the next available Client ID
//   const clientId = imgurClientManager.getClientId();
//   // console.log('clientId', clientId);
//   try {
//     const imgurResponse = await fetch('https://api.imgur.com/3/image', {
//       method: 'POST',
//       headers: {
//         Authorization: `Client-ID ${clientId}`,
//       },
//       body: file,
//     });

//     const data = await imgurResponse.json();

//     if (imgurResponse.ok) {
//       // console.log('data', data);
//       return NextResponse.json({ success: true, data: data.data });
//     } else {
//       return NextResponse.json(
//         { success: false, error: data.data.error },
//         { status: imgurResponse.status }
//       );
//     }
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }
