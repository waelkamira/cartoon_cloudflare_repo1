import Papa from 'papaparse';
export const runtime = 'edge';

const cache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // مدة الكاش 30 دقيقة لزيادة الفعالية
let csvData = null; // متغير لتخزين بيانات CSV

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const seriesName = searchParams.get('seriesName') || '';
  const episodeName = searchParams.get('episodeName') || '';
  // console.log('seriesName', seriesName, episodeName);

  // التحقق من المدخلات
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
    // console.log('seriesName', seriesName, episodeName);
    return new Response(JSON.stringify(cachedData.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // تحميل ملف CSV من URL فقط إذا لم يكن محملاً سابقًا
    if (!csvData) {
      const response = await fetch(
        'https://raw.githubusercontent.com/waelkamira/csv/refs/heads/main/episodes.csv'
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const fileContent = await response.text();
      csvData = Papa.parse(fileContent, { header: true }).data; // حفظ البيانات في الذاكرة
    }

    // فلترة الحلقات بناءً على السلسلة والحلقة المطلوبة
    const episodes = csvData.filter(
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

    // console.log('Serving from file:', seriesName, episodeName);
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
