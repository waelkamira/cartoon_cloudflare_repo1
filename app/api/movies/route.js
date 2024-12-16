import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';
export const runtime = 'edge';

// الكاش لتخزين البيانات مؤقتًا
const cache = {
  data: null,
  lastUpdated: null,
};

const CACHE_DURATION = 15 * 60 * 1000; // 15 دقيقة

// رابط ملف الأفلام من GitHub
const moviesUrl =
  'https://raw.githubusercontent.com/waelkamira/csv/refs/heads/main/movies.csv';

// دالة للتحقق من صلاحية الكاش
const isCacheValid = () => {
  return cache.data && Date.now() - cache.lastUpdated < CACHE_DURATION;
};

// دالة لجلب وتحليل محتوى CSV من الرابط
async function fetchCsvData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch CSV data');
  }
  const csvText = await response.text();
  return Papa.parse(csvText, { header: true, skipEmptyLines: true }).data;
}

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const page = parseInt(searchParams.get('page')) || 1; // رقم الصفحة
  const limit = parseInt(searchParams.get('limit')) || 4; // عدد العناصر لكل صفحة
  const skip = (page - 1) * limit; // حساب بداية العرض
  const movieName = searchParams.get('movieName') || ''; // البحث عن فيلم محدد
  const mostViewed = searchParams.get('mostViewed') || 'false'; // التحقق إذا كانت الأكثر مشاهدة
  console.log('mostViewed', mostViewed);
  try {
    let movies = [];

    // التحقق من الكاش
    if (isCacheValid()) {
      movies = cache.data;
    } else {
      // جلب البيانات من ملف CSV
      movies = await fetchCsvData(moviesUrl);
      // تحديث الكاش بالبيانات الجديدة
      cache.data = movies;
      cache.lastUpdated = Date.now();
    }

    // البحث عن فيلم معين بناءً على الاسم إذا تم تقديمه
    if (movieName) {
      const filteredMovies = movies.filter((movie) =>
        movie.movieName.toLowerCase().includes(movieName.toLowerCase())
      );
      return new Response(JSON.stringify(filteredMovies), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ترتيب الأفلام بناءً على الأكثر مشاهدة أو بشكل عشوائي
    if (mostViewed === 'true') {
      movies.sort((a, b) => {
        const dateA = new Date(a['updated_at']);
        const dateB = new Date(b['updated_at']);
        return dateA - dateB; // ترتيب تنازلي حسب تاريخ التحديث
      });
    } else {
      movies.sort(() => Math.random() - 0.5); // ترتيب عشوائي
    }

    // تطبيق pagination
    const paginatedMovies = movies.slice(skip, skip + limit);

    return new Response(JSON.stringify(paginatedMovies), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // التعامل مع أي أخطاء تحدث أثناء جلب البيانات أو معالجتها
    console.error('Error fetching movies:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req) {
  try {
    // قراءة البيانات من الطلب
    const { movieName, movieImage, movieLink } = await req.json();

    // قراءة الأفلام الحالية من الكاش أو من الرابط
    let movies = [];
    if (isCacheValid()) {
      movies = cache.data;
    } else {
      movies = await fetchCsvData(moviesUrl);
    }

    // إضافة فيلم جديد
    const newMovie = {
      id: uuidv4(),
      movieName,
      movieImage,
      movieLink,
      mostViewed: false,
      created_at: new Date().toISOString(), // إضافة created_at
      updated_at: new Date().toISOString(), // إضافة updated_at
    };

    // إضافة الفيلم إلى الكاش فقط
    movies.push(newMovie);
    cache.data = movies;
    cache.lastUpdated = Date.now();

    console.log('New movie added (cached only):', newMovie);
    return new Response(JSON.stringify(newMovie), {
      status: 201,
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

export async function PUT(req) {
  try {
    const { id, ...data } = await req.json(); // الحصول على البيانات المرسلة
    const url = new URL(req.url);
    const movieName = url.searchParams.get('movieName'); // استخراج movieName من معلمات البحث

    // قراءة الأفلام الحالية من الكاش أو من الرابط
    let movies = [];
    if (isCacheValid()) {
      movies = cache.data;
    } else {
      movies = await fetchCsvData(moviesUrl);
    }

    // تحديث الفيلم بناءً على id أو movieName
    const updatedMovies = movies.map((movie) => {
      if (movie.id === id || (movieName && movie.movieName === movieName)) {
        return {
          ...movie,
          movieName: data?.movieName || movie.movieName,
          movieImage: data?.movieImage || movie.movieImage,
          movieLink: data?.movieLink || movie.movieLink,
          mostViewed: data?.mostViewed || movie.mostViewed,
          updated_at: new Date().toISOString(), // تحديث updated_at عند التعديل
        };
      }
      return movie;
    });

    // تحديث الكاش بعد التعديل
    cache.data = updatedMovies;
    cache.lastUpdated = Date.now();

    const updatedMovie = updatedMovies.find(
      (movie) => movie.id === id || movie.movieName === movieName
    );
    return new Response(JSON.stringify(updatedMovie), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
