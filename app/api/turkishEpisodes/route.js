import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';
export const runtime = 'edge';

const cache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// رابط ملف turkishEpisodes من GitHub
const turkishEpisodesUrl =
  'https://raw.githubusercontent.com/waelkamira/csv/refs/heads/main/turkishCartoon.csv';

// دالة لجلب وتحليل محتوى CSV من الرابط
async function fetchCsvData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch CSV data');
  const csvText = await response.text();
  return Papa.parse(csvText, { header: true, skipEmptyLines: true }).data;
}

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const episodeName = searchParams.get('episodeName') || '';
  const cacheKey = `episode-${episodeName}`;
  const cachedData = cache.get(cacheKey);

  // التحقق إذا كانت البيانات في الكاش ولا تزال صالحة
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    // console.log('Serving from cache:', episodeName);
    return new Response(JSON.stringify(cachedData.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // جلب الحلقات من CSV إذا لم تكن موجودة في الكاش
    const turkishEpisodes = await fetchCsvData(turkishEpisodesUrl);

    // البحث عن الحلقة المطلوبة
    const episode = turkishEpisodes.find((ep) =>
      ep.episodeName.toLowerCase().includes(episodeName.toLowerCase())
    );

    if (!episode) {
      return new Response(JSON.stringify({ error: 'Episode not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // تخزين الحلقة في الكاش
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
    const turkishEpisodes = await fetchCsvData(turkishEpisodesUrl);

    const newEpisode = { id: uuidv4(), seriesName, episodeName, episodeLink };
    turkishEpisodes.push(newEpisode);

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
