import Papa from 'papaparse';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid'; // استخدام مكتبة UUID لتوليد معرفات فريدة
export const runtime = 'edge';

// روابط ملفات CSV من GitHub
const csvUrls = {
  serieses:
    'https://raw.githubusercontent.com/waelkamira/csv/refs/heads/main/turkishCartoon.csv',
};

// مدة الكاش بالمللي ثانية (15 دقيقة)
const CACHE_DURATION = 15 * 60 * 1000;

// التخزين المؤقت للبيانات
const cache = {
  data: null,
  lastUpdated: null,
  params: {}, // لتخزين معايير الفلترة
};

// وظيفة للتحقق إذا كان الكاش صالحًا بناءً على المعايير
function isCacheValid(seriesName, planetName, mostViewed) {
  return (
    cache.data &&
    Date.now() - cache.lastUpdated < CACHE_DURATION &&
    cache.params.seriesName === seriesName &&
    cache.params.planetName === planetName &&
    cache.params.mostViewed === mostViewed
  );
}

// وظيفة مساعدة لجلب وتحليل محتوى CSV من الرابط
async function fetchCsvData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch CSV data');
  const csvText = await response.text();
  return Papa.parse(csvText, { header: true, skipEmptyLines: true }).data;
}

// وظيفة GET لمعالجة الطلبات
export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 4; // تعيين limit بـ 4
  const skip = (page - 1) * limit;
  const seriesName = searchParams.get('seriesName') || '';
  const planetName = searchParams.get('planetName') || '';
  const mostViewed = searchParams.get('mostViewed') === 'true'; // تحويل إلى Boolean

  try {
    let serieses;

    // تحقق مما إذا كانت بيانات الكاش صالحة
    if (isCacheValid(seriesName, planetName, mostViewed)) {
      // console.log('Serving from cache...');
      serieses = cache.data;
    } else {
      // جلب البيانات من CSV على GitHub
      serieses = await fetchCsvData(csvUrls.serieses);

      // تحديث الكاش
      cache.data = serieses;
      cache.lastUpdated = Date.now();
      cache.params = { seriesName, planetName, mostViewed };
    }

    // فلترة البيانات بناءً على اسم المسلسل أو الكوكب
    if (seriesName) {
      serieses = serieses.filter((series) => series.seriesName === seriesName);
    }

    if (planetName) {
      serieses = serieses.filter((series) => series.planetName === planetName);
    }

    // فلترة المشاهدات إذا كانت معايير البحث تشملها
    if (mostViewed) {
      serieses = serieses.filter((series) => series.mostViewed === 'true');
    }

    // ترتيب البيانات بناءً على المعايير
    if (mostViewed) {
      // ترتيب بناءً على updated_at
      serieses.sort(
        (a, b) => new Date(a['updated_at']) - new Date(b['updated_at'])
      );
    } else {
      // ترتيب عشوائي
      serieses.sort(() => Math.random() - 0.5);
    }

    // تقسيم البيانات حسب الصفحة الحالية
    const paginatedData = serieses.slice(skip, skip + limit);

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
