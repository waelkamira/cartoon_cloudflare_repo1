import Papa from 'papaparse';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid'; // استخدام مكتبة UUID لتوليد معرفات فريدة
export const runtime = 'edge';
// روابط ملفات CSV من GitHub
const csvUrls = {
  serieses:
    'https://raw.githubusercontent.com/waelkamira/csv/refs/heads/main/serieses.csv',
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

// import fs from 'fs';
// import path from 'path';
// import Papa from 'papaparse'; // استخدام مكتبة PapaParse
// import { NextResponse } from 'next/server';

// const cache = {
//   data: null,
//   lastUpdated: null,
// };

// // مدة الـ cache بالمللي ثانية (مثلاً 15 دقيقة)
// const CACHE_DURATION = 15 * 60 * 1000;

// // وظيفة للتحقق إذا كان الـ cache صالحًا
// function isCacheValid() {
//   return cache.data && Date.now() - cache.lastUpdated < CACHE_DURATION;
// }

// // وظيفة مساعدة لقراءة ملف CSV وتحويله إلى كائن JSON باستخدام PapaParse
// async function readCSVFile(filePath) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(filePath, 'utf8', (err, data) => {
//       if (err) {
//         return reject(err);
//       }
//       Papa.parse(data, {
//         header: true,
//         complete: (results) => resolve(results.data),
//         error: (error) => reject(error),
//       });
//     });
//   });
// }

// // وظيفة مساعدة لكتابة بيانات إلى ملف CSV باستخدام PapaParse
// async function writeCSVFile(filePath, data) {
//   return new Promise((resolve, reject) => {
//     const csv = Papa.unparse(data);
//     fs.writeFile(filePath, csv, 'utf8', (err) => {
//       if (err) {
//         return reject(err);
//       }
//       resolve();
//     });
//   });
// }
// export async function GET(req) {
//   const url = new URL(req.url);
//   const searchParams = url.searchParams;
//   const page = parseInt(searchParams.get('page')) || 1;
//   const limit = parseInt(searchParams.get('limit')) || 4; // تحديد limit بـ 4
//   const skip = (page - 1) * limit;
//   const seriesName = searchParams.get('seriesName') || '';
//   const planetName = searchParams.get('planetName') || '';
//   const mostViewed = searchParams.get('mostViewed') === 'true'; // تحويل القيمة إلى Boolean

//   try {
//     let serieses;

//     // تحقق مما إذا كانت بيانات الـ cache صالحة
//     if (isCacheValid()) {
//       serieses = cache.data;
//     } else {
//       // مسار ملف CSV
//       const filePath = path.join(process.cwd(), 'csv', 'serieses.csv');
//       const fileContent = fs.readFileSync(filePath, 'utf8');

//       // تحليل بيانات CSV باستخدام PapaParse
//       const parsedData = Papa.parse(fileContent, { header: true });
//       serieses = parsedData.data;

//       // تحديث الـ cache
//       cache.data = serieses;
//       cache.lastUpdated = Date.now();
//     }

//     // فلترة البيانات حسب اسم المسلسل أو الكوكب
//     if (seriesName) {
//       serieses = serieses.filter((series) => series.seriesName === seriesName);
//     }

//     if (planetName) {
//       serieses = serieses.filter((series) => series.planetName === planetName);
//     }

//     if (planetName && mostViewed) {
//       serieses = serieses.filter((series) => series.mostViewed === 'true');
//     }

//     // ترتيب البيانات
//     if (mostViewed) {
//       // ترتيب بناءً على updated_at إذا كان mostViewed === true
//       serieses.sort((a, b) => {
//         const dateA = new Date(a['updated_at']);
//         const dateB = new Date(b['updated_at']);
//         return dateA - dateB;
//       });
//     } else {
//       // ترتيب عشوائي إذا كان mostViewed === false
//       serieses.sort(() => Math.random() - 0.5);
//     }

//     // تقسيم البيانات للصفحة الحالية
//     const paginatedData = serieses.slice(skip, skip + limit);

//     return new Response(JSON.stringify(paginatedData), {
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//     });
//   }
// }
// // export async function GET(req) {
// //   const url = new URL(req.url);
// //   const searchParams = url.searchParams;
// //   const page = parseInt(searchParams.get('page')) || 1;
// //   const limit = parseInt(searchParams.get('limit')) || 4; // تحديد limit بـ 4
// //   const skip = (page - 1) * limit;
// //   const seriesName = searchParams.get('seriesName') || '';
// //   const planetName = searchParams.get('planetName') || '';
// //   const mostViewed = searchParams.get('mostViewed') === 'true'; // تحويل القيمة إلى Boolean

// //   try {
// //     // مسار ملف CSV
// //     const filePath = path.join(process.cwd(), 'csv', 'serieses.csv');
// //     const fileContent = fs.readFileSync(filePath, 'utf8');

// //     // تحليل بيانات CSV باستخدام PapaParse
// //     const parsedData = Papa.parse(fileContent, { header: true });
// //     let serieses = parsedData.data;

// //     // فلترة البيانات حسب اسم المسلسل أو الكوكب
// //     if (seriesName) {
// //       serieses = serieses.filter((series) => series.seriesName === seriesName);
// //     }

// //     if (planetName) {
// //       serieses = serieses.filter((series) => series.planetName === planetName);
// //     }

// //     if (planetName && mostViewed) {
// //       serieses = serieses.filter((series) => series.mostViewed === 'true');
// //     }

// //     // ترتيب البيانات
// //     if (mostViewed) {
// //       // ترتيب بناءً على updated_at إذا كان mostViewed === true
// //       serieses.sort((a, b) => {
// //         const dateA = new Date(a['updated_at']);
// //         const dateB = new Date(b['updated_at']);
// //         return dateA - dateB;
// //       });
// //     } else {
// //       // ترتيب عشوائي إذا كان mostViewed === false
// //       serieses.sort(() => Math.random() - 0.5);
// //     }

// //     // تقسيم البيانات للصفحة الحالية
// //     const paginatedData = serieses.slice(skip, skip + limit);

// //     return new Response(JSON.stringify(paginatedData), {
// //       headers: { 'Content-Type': 'application/json' },
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     return new Response(JSON.stringify({ error: error.message }), {
// //       status: 500,
// //     });
// //   }
// // }

// export async function POST(req) {
//   const { seriesName, seriesImage, planetName } = await req.json();

//   try {
//     // مسار ملف CSV
//     const filePath = path.join(process.cwd(), 'csv', 'serieses.csv');
//     const fileContent = fs.readFileSync(filePath, 'utf8');

//     // قراءة وتحليل البيانات الحالية
//     const parsedData = Papa.parse(fileContent, { header: true });
//     const serieses = parsedData.data;

//     // إضافة السجل الجديد
//     const newSeries = {
//       id: uuidv4(),
//       seriesName,
//       seriesImage,
//       planetName,
//       mostViewed: false,
//     };
//     serieses.push(newSeries);

//     // تحويل البيانات مرة أخرى إلى CSV
//     const updatedCSV = Papa.unparse(serieses);

//     // كتابة البيانات إلى ملف CSV
//     fs.writeFileSync(filePath, updatedCSV, 'utf8');

//     return new Response(JSON.stringify(newSeries), {
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//     });
//   }
// }

// export async function PUT(req) {
//   const { id } = await req.json();

//   try {
//     // مسار ملف CSV
//     const filePath = path.join(process.cwd(), 'csv', 'serieses.csv');
//     const fileContent = fs.readFileSync(filePath, 'utf8');

//     // قراءة وتحليل البيانات الحالية
//     const parsedData = Papa.parse(fileContent, { header: true });
//     const serieses = parsedData.data;

//     // تحديث السجل المحدد
//     const updatedSerieses = serieses.map((series) => {
//       if (series.id === id) {
//         return { ...series, mostViewed: true };
//       }
//       return series;
//     });

//     // تحويل البيانات مرة أخرى إلى CSV
//     const updatedCSV = Papa.unparse(updatedSerieses);

//     // كتابة البيانات إلى ملف CSV
//     fs.writeFileSync(filePath, updatedCSV, 'utf8');

//     const updatedSeries = updatedSerieses.find((series) => series.id === id);

//     return new Response(JSON.stringify(updatedSeries), {
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error(error);
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
//   const page = parseInt(searchParams.get('page')) || 1;
//   const limit = parseInt(searchParams.get('limit')) || 4; // تحديد limit بـ 4
//   const skip = (page - 1) * limit;
//   const seriesName = searchParams.get('seriesName') || '';
//   const planetName = searchParams.get('planetName') || '';
//   const mostViewed = searchParams.get('mostViewed') || false;
//   // console.log(
//   //   page,
//   //   limit,
//   //   skip,
//   //   seriesName,
//   //   'planetName',
//   //   planetName,
//   //   'mostViewed',
//   //   mostViewed
//   // );

//   try {
//     const order = mostViewed ? 'updated_at' : 'created_at';
//     const ascending = mostViewed ? true : false;
//     // console.log('order', order);
//     let query = supabase1
//       .from('serieses')
//       .select('*')
//       .range(skip, skip + limit - 1)
//       .order(order, { ascending: ascending });

//     if (seriesName) {
//       query = query.eq('seriesName', seriesName);
//     }

//     if (planetName) {
//       query = query.eq('planetName', planetName);
//     }

//     if (planetName && mostViewed) {
//       query = query.eq('mostViewed', true); // جلب المسلسلات الأكثر مشاهدة فقط
//     }

//     let { data: serieses, error: createError } = await query;
//     // console.log('serieses', serieses);

//     if (createError) {
//       throw createError;
//     }

//     return Response.json(serieses);
//   } catch (error) {
//     console.error(error);
//     return Response.json({ error: error.message });
//   }
// }
// export async function POST(req) {
//   const { seriesName, seriesImage, planetName } = await req?.json();
//   try {
//     const { data: series, error: createError } = await supabase1
//       .from('serieses')
//       .insert([{ id: uuidv4(), seriesName, seriesImage, planetName }])
//       .select();

//     // console.log(seriesName, seriesImage);
//     if (createError) {
//       throw createError;
//     }

//     return Response.json(series);
//   } catch (error) {
//     console.error(error);
//     return new Response(stringify.json({ error: error?.message }), {
//       status: 500,
//     });
//   }
// }

// export async function PUT(req) {
//   const { id } = await req?.json();
//   // console.log('id', id);

//   try {
//     const { data: series, error: createError } = await supabase1
//       .from('serieses')
//       .update({ mostViewed: true }) // قم بتعيين القيمة الجديدة لـ mostViewed هنا
//       .eq('id', id) // استبدل desiredID بالـ id المطلوب
//       .select();

//     // console.log(seriesName, seriesImage);
//     if (createError) {
//       throw createError;
//     }

//     return Response.json(series);
//   } catch (error) {
//     console.error(error);
//     return new Response(stringify.json({ error: error?.message }), {
//       status: 500,
//     });
//   }
// }
