import Papa from 'papaparse';
export const runtime = 'edge';

const cache = {
  data: null,
  lastUpdated: null,
};

const CACHE_DURATION = 30 * 60 * 1000; // تم زيادة مدة الكاش إلى 30 دقيقة

// رابط ملف CSV المستضاف على GitHub
const csvUrl =
  'https://raw.githubusercontent.com/waelkamira/csv/refs/heads/main/songs.csv';

// التحقق من صلاحية الكاش
function isCacheValid() {
  return cache.data && Date.now() - cache.lastUpdated < CACHE_DURATION;
}

// قراءة ملف CSV من الرابط وتحويله إلى JSON باستخدام PapaParse
async function readCSVFile(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch CSV data');
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
  const songId = searchParams.get('songId') || '';
  const random = searchParams.get('random');

  try {
    let songs;

    if (isCacheValid()) {
      songs = cache.data;
    } else {
      songs = await readCSVFile(csvUrl);
      // console.log('Fetched Songs:', songs); // تحقق من البيانات
      cache.data = songs;
      cache.lastUpdated = Date.now();
    }

    if (songId) {
      songs = songs.filter((song) => song.id === songId);
    }

    if (random === 'true') {
      console.log('random', random);
      songs = songs.sort(
        (a, b) => new Date(a.updated_at) - new Date(b.updated_at)
      );
    } else {
      // console.log('songs', songs);
      console.log('random else', random);

      songs = songs.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    }

    if (songs.length === 0) {
      console.log('No songs found after filtering.');
    }

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
  const { songId, songImage, songLink } = await req.json();

  try {
    // جلب البيانات الحالية من CSV
    let songs = await readCSVFile(csvUrl);

    // إضافة الأغنية الجديدة
    const newSong = {
      songId,
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
