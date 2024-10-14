import Papa from 'papaparse';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid'; // استخدام مكتبة UUID لتوليد معرفات فريدة
export const runtime = 'edge';

// روابط ملفات CSV من GitHub
const csvUrls = {
  serieses:
    'https://raw.githubusercontent.com/waelkamira/csv/refs/heads/main/turkishCartoon.csv',
};

// مدة الـ cache بالمللي ثانية (مثلاً 15 دقيقة)
const CACHE_DURATION = 15 * 60 * 1000;

// التخزين المؤقت للبيانات
const cache = {
  data: null,
  lastUpdated: null,
  params: {}, // لتخزين معايير الفلترة
};

// وظيفة للتحقق إذا كان الـ cache صالحًا بناءً على المعايير
function isCacheValid(seriesName, planetName, mostViewed) {
  return (
    cache.data &&
    Date.now() - cache.lastUpdated < CACHE_DURATION &&
    cache.params.seriesName === seriesName &&
    cache.params.planetName === planetName &&
    cache.params.mostViewed === mostViewed
  );
}

// وظيفة مساعدة لجلب وتحليل محتوى CSV من رابط
async function fetchCsvData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch CSV data');
  const csvText = await response.text();
  return Papa.parse(csvText, { header: true, skipEmptyLines: true }).data;
}

// وظيفة مساعدة لكتابة البيانات إلى ملف CSV (محاكاة للكتابة باستخدام GitHub API)
async function writeCsvData(data) {
  const csvContent = Papa.unparse(data);
  // هنا يجب استخدام GitHub API أو آلية مشابهة لرفع التعديلات إلى GitHub
  // لا يمكن استخدام `fs` مباشرة لأننا نعمل في بيئة سيرفر مثل Vercel أو Netlify.
  console.log('CSV content to be updated:', csvContent);
  return csvContent;
}

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 4; // تحديد limit بـ 4
  const skip = (page - 1) * limit;
  const seriesName = searchParams.get('seriesName') || '';
  const planetName = searchParams.get('planetName') || '';
  const mostViewed = searchParams.get('mostViewed') === 'true'; // تحويل القيمة إلى Boolean

  try {
    let serieses;

    // تحقق مما إذا كانت بيانات الـ cache صالحة بناءً على معايير البحث
    if (isCacheValid(seriesName, planetName, mostViewed)) {
      console.log('Serving from cache...');
      serieses = cache.data;
    } else {
      console.log('Fetching new data from CSV...');
      // قراءة وتحليل البيانات من CSV على GitHub
      serieses = await fetchCsvData(csvUrls.serieses);

      // تحديث الـ cache مع المعايير الجديدة
      cache.data = serieses;
      cache.lastUpdated = Date.now();
      cache.params = { seriesName, planetName, mostViewed };
    }

    // فلترة البيانات حسب اسم المسلسل أو الكوكب
    if (seriesName) {
      serieses = serieses.filter((series) => series.seriesName === seriesName);
    }

    if (planetName) {
      serieses = serieses.filter((series) => series.planetName === planetName);
    }

    if (planetName && mostViewed) {
      serieses = serieses.filter((series) => series.mostViewed === 'true');
    }

    // ترتيب البيانات
    if (mostViewed) {
      // ترتيب بناءً على updated_at إذا كان mostViewed === true
      serieses.sort((a, b) => {
        const dateA = new Date(a['updated_at']);
        const dateB = new Date(b['updated_at']);
        return dateA - dateB;
      });
    } else {
      // ترتيب عشوائي إذا كان mostViewed === false
      serieses.sort(() => Math.random() - 0.5);
    }

    // تقسيم البيانات للصفحة الحالية
    const paginatedData = serieses.slice(skip, skip + limit);
    // console.log('episodes', paginatedData);
    return new Response(JSON.stringify(paginatedData), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  const { seriesName, seriesImage, planetName } = await req.json();

  try {
    // قراءة البيانات من CSV على GitHub
    const serieses = await fetchCsvData(csvUrls.serieses);

    // إضافة السجل الجديد
    const newSeries = {
      id: uuidv4(),
      seriesName,
      seriesImage,
      planetName,
      mostViewed: false,
    };
    serieses.push(newSeries);

    // تحديث البيانات في CSV باستخدام دالة محاكاة للكتابة
    await writeCsvData(serieses);

    // مسح الكاش لضمان التحديث في الاستعلامات التالية
    cache.data = null;

    return new Response(JSON.stringify(newSeries), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  const { id } = await req.json();

  try {
    // قراءة البيانات من CSV على GitHub
    const serieses = await fetchCsvData(csvUrls.serieses);

    // تحديث السجل المحدد
    const updatedSerieses = serieses.map((series) => {
      if (series.id === id) {
        return { ...series, mostViewed: true };
      }
      return series;
    });

    // تحديث البيانات في CSV باستخدام دالة محاكاة للكتابة
    await writeCsvData(updatedSerieses);

    // مسح الكاش لضمان التحديث في الاستعلامات التالية
    cache.data = null;

    const updatedSeries = updatedSerieses.find((series) => series.id === id);

    return new Response(JSON.stringify(updatedSeries), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
