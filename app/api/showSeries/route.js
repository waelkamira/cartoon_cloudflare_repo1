import Papa from 'papaparse';

const cache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // مدة الكاش 15 دقيقة
export const runtime = 'edge';
export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const seriesName = searchParams.get('seriesName') || '';
  const episodeName = searchParams.get('episodeName') || '';
  console.log('seriesName', seriesName);
  console.log('episodeName', episodeName);

  if (!seriesName || !episodeName) {
    return new Response(
      JSON.stringify({
        error: 'seriesName and episodeName parameters are required',
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const cacheKey = `series-${seriesName}-episode-${episodeName}`;
  const cachedData = cache.get(cacheKey);

  // التحقق إذا كانت البيانات في الكاش ولم تنتهي صلاحيتها
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    console.log('Serving from cache:', seriesName, episodeName);
    return new Response(JSON.stringify(cachedData.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // تحميل ملف CSV من URL باستخدام fetch
    const response = await fetch(
      'https://raw.githubusercontent.com/waelkamira/csv/refs/heads/main/episodes.csv'
    );

    // التأكد من أن الاستجابة كانت ناجحة
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const fileContent = await response.text(); // قراءة المحتوى كنص

    // استخدم Papa.parse لقراءة البيانات من الملف
    const parsedData = Papa.parse(fileContent, { header: true });
    const episodes = parsedData.data.filter(
      (episode) =>
        episode.seriesName === seriesName && episode.episodeName === episodeName
    );

    if (episodes.length === 0) {
      return new Response(JSON.stringify({ error: 'No episodes found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // حفظ البيانات في الكاش بعد استرجاعها
    cache.set(cacheKey, {
      data: episodes,
      timestamp: Date.now(),
    });

    console.log('Serving from file:', seriesName, episodeName);
    return new Response(JSON.stringify(episodes), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching episode:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// import fs from 'fs';
// import path from 'path';
// import Papa from 'papaparse';
// const cache = new Map();
// const CACHE_TTL = 15 * 60 * 1000; // مدة الكاش 15 دقيقة

// export async function GET(req) {
//   const url = new URL(req.url);
//   const searchParams = url.searchParams;
//   const seriesName = searchParams.get('seriesName') || '';
//   const episodeName = searchParams.get('episodeName') || '';
//   console.log('seriesName', seriesName);
//   console.log('episodeName', episodeName);

//   if (!seriesName || !episodeName) {
//     return new Response(
//       JSON.stringify({
//         error: 'seriesName and episodeName parameters are required',
//       }),
//       { status: 400, headers: { 'Content-Type': 'application/json' } }
//     );
//   }

//   const cacheKey = `series-${seriesName}-episode-${episodeName}`;
//   const cachedData = cache.get(cacheKey);

//   // التحقق إذا كانت البيانات في الكاش ولم تنتهي صلاحيتها
//   if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
//     console.log('Serving from cache:', seriesName, episodeName);
//     return new Response(JSON.stringify(cachedData.data), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }

//   try {
//     const filePath = path.join(process.cwd(), 'csv', '/episodes.csv'); // تأكد من المسار الصحيح للملف
//     const file = fs.readFileSync(filePath, 'utf8');

//     // استخدم Papa.parse لقراءة البيانات من الملف
//     const parsedData = Papa.parse(file, { header: true });
//     const episodes = parsedData.data.filter(
//       (episode) =>
//         episode.seriesName === seriesName && episode.episodeName === episodeName
//     );

//     if (episodes.length === 0) {
//       return new Response(JSON.stringify({ error: 'No episodes found' }), {
//         status: 404,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     // حفظ البيانات في الكاش بعد استرجاعها
//     cache.set(cacheKey, {
//       data: episodes,
//       timestamp: Date.now(),
//     });

//     console.log('Serving from file:', seriesName, episodeName);
//     return new Response(JSON.stringify(episodes), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error fetching episode:', error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }

// export async function GET(req) {
//   const url = new URL(req.url);
//   const searchParams = url.searchParams;
//   const seriesName = searchParams.get('seriesName') || '';
//   const episodeName = searchParams.get('episodeName') || '';
//   console.log('seriesName', seriesName);
//   console.log('episodeName', episodeName);

//   if (!seriesName || !episodeName) {
//     return new Response(
//       JSON.stringify({
//         error: 'seriesName and episodeName parameters are required',
//       }),
//       { status: 400, headers: { 'Content-Type': 'application/json' } }
//     );
//   }

//   try {
//     const filePath = path.join(process.cwd(), 'csv', '/episodes.csv'); // تأكد من المسار الصحيح للملف
//     const file = fs.readFileSync(filePath, 'utf8');

//     // استخدم Papa.parse لقراءة البيانات من الملف
//     const parsedData = Papa.parse(file, { header: true });
//     const episodes = parsedData.data.filter(
//       (episode) =>
//         episode.seriesName === seriesName && episode.episodeName === episodeName
//     );

//     if (episodes.length === 0) {
//       return new Response(JSON.stringify({ error: 'No episodes found' }), {
//         status: 404,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     return new Response(JSON.stringify(episodes), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error fetching episode:', error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }

// import { supabase1 } from '../../../lib/supabaseClient1';

// export async function GET(req) {
//   const url = new URL(req.url);
//   const searchParams = url.searchParams;
//   const seriesName = searchParams.get('seriesName') || '';
//   const episodeName = searchParams.get('episodeName') || '';
//   console.log('seriesName', seriesName);
//   console.log('episodeName', episodeName);

//   if (!seriesName || !episodeName) {
//     return new Response(
//       JSON.stringify({
//         error: 'seriesName and episodeName parameters are required',
//       }),
//       { status: 400, headers: { 'Content-Type': 'application/json' } }
//     );
//   }

//   try {
//     let { data: episodes, error: createError } = await supabase1
//       .from('episodes')
//       .select('*')
//       .eq('seriesName', seriesName)
//       .eq('episodeName', episodeName)
//       .order('created_at', { ascending: true });

//     if (createError) {
//       throw createError;
//     }

//     return new Response(JSON.stringify(episodes), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error fetching episode:', error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }
