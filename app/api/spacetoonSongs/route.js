import Papa from 'papaparse';
export const runtime = 'edge';

// إعداد الكاش لتخزين البيانات
const cache = {
  data: null,
  lastUpdated: null,
};

const CACHE_DURATION = 15 * 60 * 1000; // مدة الكاش: 15 دقيقة

// رابط ملف CSV المستضاف على GitHub
const csvUrl =
  'https://raw.githubusercontent.com/waelkamira/csv/refs/heads/main/spacetoonSongs.csv';

// التحقق مما إذا كان الكاش صالحًا
function isCacheValid() {
  return cache.data && Date.now() - cache.lastUpdated < CACHE_DURATION;
}

// دالة لقراءة ملف CSV من الرابط باستخدام fetch
async function readCSVFile(url) {
  const response = await fetch(url);
  const csvText = await response.text();
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
}

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 4;
  const skip = (page - 1) * limit;
  const spacetoonSongName = searchParams.get('spacetoonSongName') || '';
  const random = searchParams.get('random') === 'true';

  try {
    let spacetoonSongs;

    // التحقق مما إذا كان الكاش صالحًا
    if (isCacheValid()) {
      spacetoonSongs = cache.data;
    } else {
      // جلب البيانات من ملف CSV على GitHub
      spacetoonSongs = await readCSVFile(csvUrl);

      // تحديث الكاش بعد الجلب
      cache.data = spacetoonSongs;
      cache.lastUpdated = Date.now();
    }

    // فلترة الأغاني بناءً على اسم الأغنية إن وجد
    if (spacetoonSongName) {
      spacetoonSongs = spacetoonSongs.filter(
        (song) =>
          song.spacetoonSongName.toLowerCase() ===
          spacetoonSongName.toLowerCase()
      );
    }

    // إذا كان random=true، نقوم بخلط الأغاني عشوائيًا
    if (random) {
      spacetoonSongs.sort(() => 0.5 - Math.random());
    } else {
      // ترتيب الأغاني بناءً على created_at
      spacetoonSongs.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
    }

    // تقسيم البيانات حسب الصفحة الحالية
    const paginatedSpacetoonSongs = spacetoonSongs.slice(skip, skip + limit);

    return new Response(JSON.stringify(paginatedSpacetoonSongs), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req) {
  const { spacetoonSongName, songImage, songLink } = await req.json();

  try {
    // جلب البيانات الحالية من ملف CSV على GitHub
    let spacetoonSongs = await readCSVFile(csvUrl);

    // إضافة الأغنية الجديدة
    const newSong = {
      spacetoonSongName,
      songImage,
      songLink,
      created_at: new Date().toISOString(),
    };
    spacetoonSongs.push(newSong);

    // هنا إذا كنت ترغب في تحديث ملف CSV على GitHub، ستحتاج إلى استخدام GitHub API
    // لتحميل الملف المحدّث إلى المستودع. هذا يتطلب استخدام Personal Access Token
    // وإجراء طلب API من نوع PUT أو POST لتحديث الملف.

    // تحديث الكاش بعد الإضافة
    cache.data = spacetoonSongs;
    cache.lastUpdated = Date.now();

    return new Response(JSON.stringify(newSong), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// import fs from 'fs';
// import path from 'path';
// import Papa from 'papaparse';
// const cache = {
//   data: null,
//   lastUpdated: null,
// };

// const CACHE_DURATION = 15 * 60 * 1000; // 15 دقيقة

// function isCacheValid() {
//   return cache.data && Date.now() - cache.lastUpdated < CACHE_DURATION;
// }

// async function readCSVFile(filePath) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(filePath, 'utf8', (err, data) => {
//       if (err) {
//         return reject(err);
//       }
//       Papa.parse(data, {
//         header: true,
//         complete: (results) => resolve(results.data),
//         error: (error) => reject(error),
//       });
//     });
//   });
// }

// export async function GET(req) {
//   const url = new URL(req.url);
//   const searchParams = url.searchParams;
//   const page = parseInt(searchParams.get('page')) || 1;
//   const limit = parseInt(searchParams.get('limit')) || 4;
//   const skip = (page - 1) * limit;
//   const spacetoonSongName = searchParams.get('spacetoonSongName') || '';
//   const random = searchParams.get('random') || false;

//   try {
//     let spacetoonSongs;

//     // التحقق مما إذا كان الـ cache صالحًا
//     if (isCacheValid()) {
//       spacetoonSongs = cache.data;
//     } else {
//       // مسار ملف CSV
//       const filePath = path.join(process.cwd(), 'csv', 'spacetoonSongs.csv');
//       spacetoonSongs = await readCSVFile(filePath);

//       // تحديث الـ cache
//       cache.data = spacetoonSongs;
//       cache.lastUpdated = Date.now();
//     }

//     // فلترة الأغاني حسب اسم الأغنية إن وجد
//     if (spacetoonSongName) {
//       spacetoonSongs = spacetoonSongs.filter(
//         (song) => song.spacetoonSongName === spacetoonSongName
//       );
//     }

//     if (random) {
//       // إذا كانت random=true، نقوم بخلط النتائج عشوائيا
//       spacetoonSongs = spacetoonSongs.sort(() => 0.5 - Math.random());
//     } else {
//       // ترتيب الأغاني بناءً على created_at
//       spacetoonSongs.sort(
//         (a, b) => new Date(a.created_at) - new Date(b.created_at)
//       );
//     }

//     // تقسيم البيانات للصفحة الحالية
//     const paginatedSpacetoonSongs = spacetoonSongs.slice(skip, skip + limit);

//     return new Response(JSON.stringify(paginatedSpacetoonSongs), {
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//     });
//   }
// }

// export async function POST(req) {
//   const { spacetoonSongName, songImage, songLink } = await req?.json();

//   try {
//     // مسار ملف CSV
//     const filePath = path.join(process.cwd(), 'csv', 'spacetoonSongs.csv');
//     const fileContent = fs.readFileSync(filePath, 'utf8');

//     // تحليل بيانات CSV باستخدام PapaParse
//     const parsedData = Papa.parse(fileContent, { header: true });
//     const spacetoonSongs = parsedData.data;

//     // إضافة الأغنية الجديدة
//     const newSong = {
//       spacetoonSongName,
//       songImage,
//       songLink,
//       created_at: new Date().toISOString(),
//     };
//     spacetoonSongs.push(newSong);

//     // إعادة كتابة البيانات إلى ملف CSV
//     const updatedCSV = Papa.unparse(spacetoonSongs);
//     fs.writeFileSync(filePath, updatedCSV);

//     // تحديث الـ cache بعد الإضافة
//     cache.data = spacetoonSongs;
//     cache.lastUpdated = Date.now();

//     return new Response(JSON.stringify(newSong), {
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//     });
//   }
// }

// import fs from 'fs';
// import path from 'path';
// import Papa from 'papaparse';

// export async function GET(req) {
//   const url = new URL(req.url);
//   const searchParams = url.searchParams;
//   const page = parseInt(searchParams.get('page')) || 1;
//   const limit = parseInt(searchParams.get('limit')) || 4; // تحديد limit بـ 4
//   const skip = (page - 1) * limit;
//   const spacetoonSongName = searchParams.get('spacetoonSongName') || '';
//   const random = searchParams.get('random') || false; // التحقق من random

//   try {
//     // مسار ملف CSV
//     const filePath = path.join(process.cwd(), 'csv', 'spacetoonSongs.csv');
//     const fileContent = fs.readFileSync(filePath, 'utf8');

//     // تحليل بيانات CSV باستخدام PapaParse
//     const parsedData = Papa.parse(fileContent, { header: true });
//     let spacetoonSongs = parsedData.data;

//     // فلترة الأغاني حسب اسم الأغنية إن وجد
//     if (spacetoonSongName) {
//       spacetoonSongs = spacetoonSongs.filter(
//         (song) => song.spacetoonSongName === spacetoonSongName
//       );
//     }

//     if (random) {
//       // إذا كانت random=true، نقوم بخلط النتائج عشوائيا
//       spacetoonSongs = spacetoonSongs.sort(() => 0.5 - Math.random());
//     } else {
//       // ترتيب الأغاني بناءً على created_at
//       spacetoonSongs.sort(
//         (a, b) => new Date(a.created_at) - new Date(b.created_at)
//       );
//     }

//     // تقسيم البيانات للصفحة الحالية
//     const paginatedSpacetoonSongs = spacetoonSongs.slice(skip, skip + limit);

//     return new Response(JSON.stringify(paginatedSpacetoonSongs), {
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//     });
//   }
// }

// export async function POST(req) {
//   const { spacetoonSongName, songImage, songLink } = await req?.json();

//   try {
//     // مسار ملف CSV
//     const filePath = path.join(process.cwd(), 'csv', 'spacetoonSongs.csv');
//     const fileContent = fs.readFileSync(filePath, 'utf8');

//     // تحليل بيانات CSV باستخدام PapaParse
//     const parsedData = Papa.parse(fileContent, { header: true });
//     const spacetoonSongs = parsedData.data;

//     // إضافة الأغنية الجديدة
//     const newSong = {
//       spacetoonSongName,
//       songImage,
//       songLink,
//       created_at: new Date().toISOString(),
//     };
//     spacetoonSongs.push(newSong);

//     // إعادة كتابة البيانات إلى ملف CSV
//     const updatedCSV = Papa.unparse(spacetoonSongs);
//     fs.writeFileSync(filePath, updatedCSV);

//     return new Response(JSON.stringify(newSong), {
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//     });
//   }
// }

// import { stringify } from 'uuid';
// import { supabase1 } from '../../../lib/supabaseClient1';
// import { v4 as uuidv4 } from 'uuid';

// export async function GET(req) {
//   const url = new URL(req.url);
//   const searchParams = url.searchParams;
//   const page = parseInt(searchParams.get('page')) || 1;
//   const limit = parseInt(searchParams.get('limit')) || 4; // تحديد limit بـ 4
//   const skip = (page - 1) * limit;
//   const spacetoonSongName = searchParams.get('spacetoonSongName') || '';
//   const random = searchParams.get('random') === 'true'; // التحقق من random

//   try {
//     let query = supabase1.from('spacetoonSongs').select('*');

//     if (spacetoonSongName) {
//       query = query.eq('spacetoonSongName', spacetoonSongName);
//     }

//     if (random) {
//       // إذا كانت random=true، نختار الأغاني بشكل عشوائي بدون استخدام order
//       let { data: allSpacetoonSongs, error: fetchError } = await query;
//       if (fetchError) {
//         throw fetchError;
//       }
//       // خلط النتائج عشوائيا
//       allSpacetoonSongs = allSpacetoonSongs.sort(() => 0.5 - Math.random());
//       // أخذ العدد المطلوب من الأغاني
//       const spacetoonSongs = allSpacetoonSongs.slice(skip, skip + limit);
//       return Response.json(spacetoonSongs);
//     } else {
//       // في حال عدم وجود random=true، نستخدم الترتيب الافتراضي
//       query = query
//         .range(skip, skip + limit - 1)
//         .order('created_at', { ascending: false });
//       let { data: spacetoonSongs, error: createError } = await query;

//       // console.log('spacetoonSongs', spacetoonSongs);
//       if (createError) {
//         throw createError;
//       }

//       return Response.json(spacetoonSongs);
//     }
//   } catch (error) {
//     console.error(error);
//     return Response.json({ error: error.message });
//   }
// }

// export async function POST(req) {
//   const { spacetoonSongName, songImage, songLink } = await req?.json();
//   try {
//     const { data: song, error: createError } = await supabase1
//       .from('spacetoonSongs')
//       .insert([{ spacetoonSongName, songImage, songLink }])
//       .select();

//     // console.log(spacetoonSongName, songImage);
//     if (createError) {
//       throw createError;
//     }

//     return Response.json(song);
//   } catch (error) {
//     console.error(error);
//     return new Response(stringify.json({ error: error?.message }), {
//       status: 500,
//     });
//   }
// }
