import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid'; // استخدام مكتبة UUID لتوليد معرفات فريدة
export const runtime = 'edge';

// روابط ملفات CSV من GitHub
const csvUrls = {
  serieses:
    'https://raw.githubusercontent.com/waelkamira/csv/refs/heads/main/serieses.csv',
};

// مدة الـ cache بالمللي ثانية (مثلاً 30 دقيقة)
const CACHE_DURATION = 30 * 60 * 1000;

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

// وظيفة لجلب البيانات المطلوبة مع تقليل الطلبات للخادم
export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 4; // تحديد limit بـ 4
  const skip = (page - 1) * limit;
  const seriesName = searchParams.get('seriesName') || '';
  const planetName = searchParams.get('planetName') || '';
  const mostViewed = searchParams.get('mostViewed') || false; // تحويل القيمة إلى Boolean

  try {
    let serieses;

    // تحقق مما إذا كانت بيانات الـ cache صالحة بناءً على معايير البحث
    if (isCacheValid(seriesName, planetName, mostViewed)) {
      serieses = cache.data;
    } else {
      // تحميل البيانات من CSV إذا لم تكن متاحة في الكاش
      // console.log('Fetching new data from CSV...');
      serieses = await fetchCsvData(csvUrls.serieses);

      // تحديث الكاش مع المعايير الجديدة
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
      serieses = serieses.filter((series) => series.mostViewed === 'True');
      // console.log('Serieses', serieses);
    }

    // ترتيب البيانات
    if (mostViewed) {
      // console.log('Serieses before sorting:', serieses);

      serieses.sort((a, b) => {
        const dateA = new Date(a['updated_at']);
        const dateB = new Date(b['updated_at']);

        return dateA - dateB;
      });
    } else {
      // ترتيب عشوائي إذا كان mostViewed === false
      // serieses.sort(() => Math.random() - 0.5);
      serieses;
    }

    // تقسيم البيانات للصفحة الحالية
    const paginatedData = serieses.slice(skip, skip + limit);
    // console.log('paginatedData', paginatedData);

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
