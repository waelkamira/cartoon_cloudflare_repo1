import Papa from 'papaparse';
export const runtime = 'edge';

const cache = {
  data: null,
  lastUpdated: null,
};

const CACHE_DURATION = 15 * 60 * 1000; // 15 دقيقة

// رابط ملف CSV المستضاف على GitHub
const csvUrl =
  'https://raw.githubusercontent.com/waelkamira/csv/refs/heads/main/englishSongs.csv';

// التحقق من صلاحية الـ Cache
function isCacheValid() {
  return cache.data && Date.now() - cache.lastUpdated < CACHE_DURATION;
}

// قراءة ملف CSV من الرابط وتحويله إلى JSON باستخدام PapaParse
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
  const songName = searchParams.get('songName') || '';
  const random = searchParams.get('random') === 'true';

  try {
    let songs;

    // تحقق من الكاش إذا كان صالحًا
    if (isCacheValid()) {
      songs = cache.data;
    } else {
      // جلب البيانات من ملف CSV على GitHub
      songs = await readCSVFile(csvUrl);

      // تحديث الكاش
      cache.data = songs;
      cache.lastUpdated = Date.now();
    }

    // فلترة الأغاني بناءً على اسم الأغنية إذا تم تحديده
    if (songName) {
      songs = songs.filter((song) =>
        song.songName.toLowerCase().includes(songName.toLowerCase())
      );
    }

    // إذا كان random=true، نقوم بخلط الأغاني عشوائياً
    if (random) {
      songs.sort(() => 0.5 - Math.random());
    } else {
      // ترتيب الأغاني بناءً على created_at
      songs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    // تقسيم البيانات حسب الصفحة المحددة
    const paginatedSongs = songs.slice(skip, skip + limit);

    return new Response(JSON.stringify(paginatedSongs), {
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
  const { songName, songImage, songLink } = await req.json();

  try {
    // جلب البيانات الحالية من CSV
    let songs = await readCSVFile(csvUrl);

    // إضافة الأغنية الجديدة
    const newSong = {
      songName,
      songImage,
      songLink,
      created_at: new Date().toISOString(),
    };
    songs.push(newSong);

    // هنا إذا كنت ترغب في تحديث ملف CSV على GitHub، يجب عليك استخدام GitHub API
    // لتحميل الملف المحدّث إلى المستودع. هذا يتطلب استخدام Personal Access Token
    // وإجراء طلب API من نوع PUT أو POST لتحديث الملف.

    // تحديث الكاش بعد الإضافة
    cache.data = songs;
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
// export const runtime = 'edge';
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
//   const songName = searchParams.get('songName') || '';
//   const random = searchParams.get('random') || false;

//   try {
//     let songs;

//     // التحقق مما إذا كان الـ cache صالحًا
//     if (isCacheValid()) {
//       songs = cache.data;
//     } else {
//       // مسار ملف CSV
//       const filePath = path.join(process.cwd(), 'csv', 'songs.csv');
//       songs = await readCSVFile(filePath);

//       // تحديث الـ cache
//       cache.data = songs;
//       cache.lastUpdated = Date.now();
//     }

//     // فلترة الأغاني حسب اسم الأغنية إن وجد
//     if (songName) {
//       songs = songs.filter((song) => song.songName === songName);
//     }

//     if (random) {
//       // إذا كانت random=true، نقوم بخلط النتائج عشوائيا
//       songs = songs.sort(() => 0.5 - Math.random());
//     } else {
//       // ترتيب الأغاني بناءً على created_at
//       songs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
//     }

//     // تقسيم البيانات للصفحة الحالية
//     const paginatedSongs = songs.slice(skip, skip + limit);

//     return new Response(JSON.stringify(paginatedSongs), {
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
//   const { songName, songImage, songLink } = await req?.json();

//   try {
//     // مسار ملف CSV
//     const filePath = path.join(process.cwd(), 'csv', 'songs.csv');
//     const fileContent = fs.readFileSync(filePath, 'utf8');

//     // تحليل بيانات CSV باستخدام PapaParse
//     const parsedData = Papa.parse(fileContent, { header: true });
//     const songs = parsedData.data;

//     // إضافة الأغنية الجديدة
//     const newSong = {
//       songName,
//       songImage,
//       songLink,
//       created_at: new Date().toISOString(),
//     };
//     songs.push(newSong);

//     // إعادة كتابة البيانات إلى ملف CSV
//     const updatedCSV = Papa.unparse(songs);
//     fs.writeFileSync(filePath, updatedCSV);

//     // تحديث الـ cache بعد الإضافة
//     cache.data = songs;
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
//   const songName = searchParams.get('songName') || '';
//   const random = searchParams.get('random') || false; // التحقق من random

//   try {
//     // مسار ملف CSV
//     const filePath = path.join(process.cwd(), 'csv', 'songs.csv');
//     const fileContent = fs.readFileSync(filePath, 'utf8');

//     // تحليل بيانات CSV باستخدام PapaParse
//     const parsedData = Papa.parse(fileContent, { header: true });
//     let songs = parsedData.data;

//     // فلترة الأغاني حسب اسم الأغنية إن وجد
//     if (songName) {
//       songs = songs.filter((song) => song.songName === songName);
//     }

//     if (random) {
//       // إذا كانت random=true، نقوم بخلط النتائج عشوائيا
//       songs = songs.sort(() => 0.5 - Math.random());
//     } else {
//       // ترتيب الأغاني بناءً على created_at
//       songs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
//     }

//     // تقسيم البيانات للصفحة الحالية
//     const paginatedSongs = songs.slice(skip, skip + limit);

//     return new Response(JSON.stringify(paginatedSongs), {
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
//   const { songName, songImage, songLink } = await req?.json();

//   try {
//     // مسار ملف CSV
//     const filePath = path.join(process.cwd(), 'csv', 'songs.csv');
//     const fileContent = fs.readFileSync(filePath, 'utf8');

//     // تحليل بيانات CSV باستخدام PapaParse
//     const parsedData = Papa.parse(fileContent, { header: true });
//     const songs = parsedData.data;

//     // إضافة الأغنية الجديدة
//     const newSong = {
//       songName,
//       songImage,
//       songLink,
//       created_at: new Date().toISOString(),
//     };
//     songs.push(newSong);

//     // إعادة كتابة البيانات إلى ملف CSV
//     const updatedCSV = Papa.unparse(songs);
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
//   const songName = searchParams.get('songName') || '';
//   const random = searchParams.get('random') === 'true'; // التحقق من random

//   try {
//     let query = supabase1.from('songs').select('*');

//     if (songName) {
//       query = query.eq('songName', songName);
//     }

//     if (random) {
//       // إذا كانت random=true، نختار الأغاني بشكل عشوائي بدون استخدام order
//       let { data: allSongs, error: fetchError } = await query;
//       if (fetchError) {
//         throw fetchError;
//       }
//       // خلط النتائج عشوائيا
//       allSongs = allSongs.sort(() => 0.5 - Math.random());
//       // أخذ العدد المطلوب من الأغاني
//       const songs = allSongs.slice(skip, skip + limit);
//       return Response.json(songs);
//     } else {
//       // في حال عدم وجود random=true، نستخدم الترتيب الافتراضي
//       query = query
//         .range(skip, skip + limit - 1)
//         .order('created_at', { ascending: false });
//       let { data: songs, error: createError } = await query;

//       // console.log('songs', songs);
//       if (createError) {
//         throw createError;
//       }

//       return Response.json(songs);
//     }
//   } catch (error) {
//     console.error(error);
//     return Response.json({ error: error.message });
//   }
// }

// export async function POST(req) {
//   const { songName, songImage, songLink } = await req?.json();
//   try {
//     const { data: song, error: createError } = await supabase1
//       .from('songs')
//       .insert([{ songName, songImage, songLink }])
//       .select();

//     // console.log(songName, songImage);
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
