import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';
export const runtime = 'edge';

const cache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// رابط ملف episodes من GitHub
const episodesUrl =
  'https://raw.githubusercontent.com/waelkamira/csv/refs/heads/main/episodes.csv';

// دالة لجلب وتحليل محتوى CSV من رابط
async function fetchCsvData(url) {
  const response = await fetch(url);
  const csvText = await response.text();
  return Papa.parse(csvText, { header: true }).data;
}

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const episodeName = searchParams.get('episodeName') || '';

  const cacheKey = `episode-${episodeName}`;
  const cachedData = cache.get(cacheKey);

  // التحقق إذا كانت البيانات موجودة في الكاش ولم تنتهي مدة صلاحيتها
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    console.log('Serving from cache:', episodeName);
    return new Response(JSON.stringify(cachedData.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const episodes = await fetchCsvData(episodesUrl);
    const episode = episodes.find((ep) => ep.episodeName === episodeName);

    if (!episode) {
      return new Response(JSON.stringify({ error: 'Episode not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // تخزين البيانات في الكاش
    cache.set(cacheKey, {
      data: [episode],
      timestamp: Date.now(),
    });

    console.log('Serving from file:', episodeName);
    return new Response(JSON.stringify([episode]), {
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

export async function POST(req) {
  // في هذا الجزء سنقوم بإضافة حل بديل لأننا لا نستطيع الكتابة إلى ملف CSV على GitHub
  const { seriesName, episodeName, episodeLink } = await req.json();
  const cacheKey = `episode-${episodeName}`;

  try {
    const episodes = await fetchCsvData(episodesUrl);

    const newEpisode = { id: uuidv4(), seriesName, episodeName, episodeLink };
    episodes.push(newEpisode);

    // تحديث الكاش بعد إضافة الحلقة الجديدة
    cache.set(cacheKey, {
      data: [newEpisode],
      timestamp: Date.now(),
    });

    console.log('New episode added (cached only):', newEpisode);
    return new Response(JSON.stringify(newEpisode), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error adding episode:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// import fs from 'fs';
// import path from 'path';
// import Papa from 'papaparse';
// import { v4 as uuidv4 } from 'uuid';

// const cache = new Map();
// const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// export async function GET(req) {
//   const url = new URL(req.url);
//   const searchParams = url.searchParams;
//   const episodeName = searchParams.get('episodeName') || '';

//   const cacheKey = `episode-${episodeName}`;
//   const cachedData = cache.get(cacheKey);

//   // Check if the episode exists in the cache and if it's not expired
//   if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
//     console.log('Serving from cache:', episodeName);
//     return new Response(JSON.stringify(cachedData.data), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }

//   try {
//     const filePath = path.join(process.cwd(), 'csv', '/episodes.csv');
//     const file = fs.readFileSync(filePath, 'utf8');
//     const parsedData = Papa.parse(file, { header: true });
//     const episode = parsedData.data.find(
//       (ep) => ep.episodeName === episodeName
//     );

//     if (!episode) {
//       return new Response(JSON.stringify({ error: 'Episode not found' }), {
//         status: 404,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     // Store the fetched episode in the cache
//     cache.set(cacheKey, {
//       data: [episode],
//       timestamp: Date.now(),
//     });

//     console.log('Serving from file:', episodeName);
//     return new Response(JSON.stringify([episode]), {
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

// export async function POST(req) {
//   const { seriesName, episodeName, episodeLink } = await req.json();
//   const cacheKey = `episode-${episodeName}`;

//   try {
//     const filePath = path.join(process.cwd(), 'csv', '/episodes.csv');
//     const file = fs.readFileSync(filePath, 'utf8');

//     const parsedData = Papa.parse(file, { header: true });
//     const episodes = parsedData.data;

//     const newEpisode = { id: uuidv4(), seriesName, episodeName, episodeLink };
//     episodes.push(newEpisode);

//     const csv = Papa.unparse(episodes);
//     fs.writeFileSync(filePath, csv);

//     // Update cache after new episode is added
//     cache.set(cacheKey, {
//       data: [newEpisode],
//       timestamp: Date.now(),
//     });

//     console.log('New episode added:', newEpisode);
//     return new Response(JSON.stringify(newEpisode), {
//       status: 201,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error adding episode:', error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//     });
//   }
// }

// export async function GET(req) {
//   const url = new URL(req.url);
//   const searchParams = url.searchParams;
//   const episodeName = searchParams.get('episodeName') || '';
//   console.log('episodeName', episodeName);

//   try {
//     const filePath = path.join(process.cwd(), 'csv', '/episodes.csv'); // تأكد من المسار الصحيح للملف
//     const file = fs.readFileSync(filePath, 'utf8');

//     // استخدم Papa.parse لقراءة البيانات من الملف
//     const parsedData = Papa.parse(file, { header: true });
//     const episode = parsedData.data.find(
//       (ep) => ep.episodeName === episodeName
//     );

//     if (!episode) {
//       return new Response(JSON.stringify({ error: 'Episode not found' }), {
//         status: 404,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }
//     console.log('episode الحلقة', episode);

//     return new Response(JSON.stringify([episode]), {
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

// export async function POST(req) {
//   const { seriesName, episodeName, episodeLink } = await req.json();
//   try {
//     const filePath = path.join(process.cwd(), 'csv', '/episodes.csv'); // تأكد من المسار الصحيح للملف
//     const file = fs.readFileSync(filePath, 'utf8');

//     // تحليل البيانات الموجودة في CSV
//     const parsedData = Papa.parse(file, { header: true });
//     const episodes = parsedData.data;

//     // إضافة الحلقة الجديدة
//     const newEpisode = { id: uuidv4(), seriesName, episodeName, episodeLink };
//     episodes.push(newEpisode);

//     // كتابة البيانات المحدثة إلى ملف CSV
//     const csv = Papa.unparse(episodes);
//     fs.writeFileSync(filePath, csv);

//     console.log('New episode added:', newEpisode);
//     return new Response(JSON.stringify(newEpisode), {
//       status: 201,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error adding episode:', error);
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
//   const episodeName = searchParams.get('episodeName') || '';
//   // const seriesName = searchParams.get('seriesName') || '';
//   console.log('episodeName', episodeName);
//   // console.log('seriesName', seriesName);
//   try {
//     let { data: episode, error: createError } = await supabase1
//       .from('episodes')
//       .select('*')
//       .eq('episodeName', episodeName);

//     if (createError) {
//       throw createError;
//     }
//     console.log('episode', episode);

//     return new Response(JSON.stringify(episode), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error fetching episode:', error);
//     return new Response(JSON.stringify({ error: error.message }));
//   }
// }
// export async function POST(req) {
//   const { seriesName, episodeName, episodeLink } = await req?.json();
//   try {
//     const { data: episode, error: createError } = await supabase1
//       .from('episodes')
//       .insert([{ id: uuidv4(), seriesName, episodeName, episodeLink }])
//       .select();

//     // console.log(seriesName, episodeName, episodeLink);
//     if (createError) {
//       throw createError;
//     }
//     console.log('episode', episode);
//     return Response.json(episode);
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ error: error?.message }), {
//       status: 500,
//     });
//   }
// }
