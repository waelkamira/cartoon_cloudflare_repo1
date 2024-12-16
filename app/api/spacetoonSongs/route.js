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
  const spacetoonSongId = searchParams.get('spacetoonSongId') || '';
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
    if (spacetoonSongId) {
      spacetoonSongs = spacetoonSongs.filter(
        (song) => song.id === spacetoonSongId
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
  const { spacetoonSongId, songImage, songLink } = await req.json();

  try {
    // جلب البيانات الحالية من ملف CSV على GitHub
    let spacetoonSongs = await readCSVFile(csvUrl);

    // إضافة الأغنية الجديدة
    const newSong = {
      spacetoonSongId,
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
