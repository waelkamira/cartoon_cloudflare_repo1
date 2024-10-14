import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';
export const runtime = 'edge';

// الكاش لتخزين البيانات محليًا
const cache = {
  data: null,
  lastUpdated: null,
};

const CACHE_DURATION = 15 * 60 * 1000; // 15 دقيقة

// رابط ملف movies من GitHub
const moviesUrl =
  'https://raw.githubusercontent.com/waelkamira/csv/refs/heads/main/movies.csv';

// دالة للتحقق من صلاحية الكاش
const isCacheValid = () => {
  return cache.data && Date.now() - cache.lastUpdated < CACHE_DURATION;
};

// دالة لجلب وتحليل محتوى CSV من رابط
async function fetchCsvData(url) {
  const response = await fetch(url);
  const csvText = await response.text();
  return Papa.parse(csvText, { header: true, skipEmptyLines: true }).data;
}

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 4;
  const skip = (page - 1) * limit;
  const movieName = searchParams.get('movieName') || '';
  const mostViewed = searchParams.get('mostViewed') === 'true'; // تحويل إلى Boolean

  try {
    let movies = [];

    if (isCacheValid()) {
      // إذا كانت بيانات الكاش صالحة، نستخدمها
      movies = cache.data;
    } else {
      // قراءة البيانات من ملف CSV عبر الرابط
      movies = await fetchCsvData(moviesUrl);
      // تحديث الكاش بالبيانات الجديدة
      cache.data = movies;
      cache.lastUpdated = Date.now();
    }

    // البحث عن فيلم معين بناءً على الاسم
    if (movieName) {
      const filteredMovies = movies.filter((movie) =>
        movie.movieName.toLowerCase().includes(movieName.toLowerCase())
      );
      return new Response(JSON.stringify(filteredMovies), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // إذا كانت قيمة mostViewed true، قم بترتيب الأفلام حسب updated_at
    // وإذا كانت false، قم بترتيب الأفلام بشكل عشوائي
    if (mostViewed) {
      movies.sort(
        (a, b) => new Date(a['updated_at']) - new Date(b['updated_at'])
      );
    } else {
      movies.sort(() => Math.random() - 0.5); // ترتيب عشوائي
    }

    // عرض الأفلام بالترتيب بناءً على mostViewed أو الترتيب العشوائي
    const paginatedMovies = movies.slice(skip, skip + limit);
    return new Response(JSON.stringify(paginatedMovies), {
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

// import { v4 as uuidv4 } from 'uuid';
// import fs from 'fs';
// import path from 'path';
// import Papa from 'papaparse';
// const cache = {
//   data: null,
//   lastUpdated: null,
// };

// const CACHE_DURATION = 15 * 60 * 1000; // 15 دقيقة

// const isCacheValid = () => {
//   return cache.data && Date.now() - cache.lastUpdated < CACHE_DURATION;
// };

// // دالة لقراءة ملف movies.csv
// const readMoviesFromCSV = () => {
//   if (isCacheValid()) {
//     // إذا كان الكاش صالح، نعيد البيانات من الكاش
//     return cache.data;
//   }

//   const filePath = path.join(process.cwd(), 'csv', '/movies.csv');
//   const fileContent = fs.readFileSync(filePath, 'utf8');
//   const { data: movies } = Papa.parse(fileContent, {
//     header: true,
//     skipEmptyLines: true,
//   });

//   // تحديث الكاش بالبيانات الجديدة
//   cache.data = movies;
//   cache.lastUpdated = Date.now();

//   return movies;
// };

// // دالة لكتابة البيانات إلى ملف movies.csv وتحديث الكاش
// const writeMoviesToCSV = (movies) => {
//   const filePath = path.join(process.cwd(), 'csv', '/movies.csv');
//   const csv = Papa.unparse(movies);
//   fs.writeFileSync(filePath, csv, 'utf8');

//   // تحديث الكاش بعد الكتابة
//   cache.data = movies;
//   cache.lastUpdated = Date.now();
// };

// export async function GET(req) {
//   const url = new URL(req.url);
//   const searchParams = url.searchParams;
//   const page = parseInt(searchParams.get('page')) || 1;
//   const limit = parseInt(searchParams.get('limit')) || 4;
//   const skip = (page - 1) * limit;
//   const movieName = searchParams.get('movieName') || '';
//   const mostViewed = searchParams.get('mostViewed') === 'true'; // تحويل إلى Boolean

//   try {
//     const movies = readMoviesFromCSV();

//     // البحث عن فيلم معين بناءً على الاسم
//     if (movieName) {
//       const filteredMovies = movies.filter((movie) =>
//         movie.movieName.toLowerCase().includes(movieName.toLowerCase())
//       );
//       return new Response(JSON.stringify(filteredMovies), {
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     // إذا كانت قيمة mostViewed true، قم بترتيب الأفلام حسب updated_at
//     // وإذا كانت false، قم بترتيب الأفلام بشكل عشوائي
//     if (mostViewed) {
//       movies.sort(
//         (a, b) => new Date(a['updated_at']) - new Date(b['updated_at'])
//       );
//     } else {
//       movies.sort(() => Math.random() - 0.5); // ترتيب عشوائي
//     }

//     // عرض الأفلام بالترتيب بناءً على mostViewed أو الترتيب العشوائي
//     const paginatedMovies = movies.slice(skip, skip + limit);
//     return new Response(JSON.stringify(paginatedMovies), {
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }

// export async function POST(req) {
//   try {
//     const { movieName, movieImage, movieLink } = await req.json();

//     // قراءة الأفلام الحالية
//     const movies = readMoviesFromCSV();

//     // إضافة فيلم جديد
//     const newMovie = {
//       id: uuidv4(),
//       movieName,
//       movieImage,
//       movieLink,
//       mostViewed: false,
//       created_at: new Date().toISOString(), // إضافة created_at
//       updated_at: new Date().toISOString(), // إضافة updated_at
//     };

//     movies.push(newMovie);

//     // كتابة البيانات إلى ملف CSV
//     writeMoviesToCSV(movies);

//     return new Response(JSON.stringify(newMovie), {
//       status: 201,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }

// export async function PUT(req) {
//   try {
//     const { id, ...data } = await req.json(); // الحصول على البيانات المرسلة
//     const url = new URL(req.url);
//     const movieName = url.searchParams.get('movieName'); // استخراج movieName من معلمات البحث

//     // قراءة الأفلام الحالية
//     const movies = readMoviesFromCSV();

//     // تحديث الفيلم بناءً على id أو movieName
//     const updatedMovies = movies.map((movie) => {
//       if (movie.id === id || (movieName && movie.movieName === movieName)) {
//         return {
//           ...movie,
//           movieName: data?.movieName || movie.movieName,
//           movieImage: data?.movieImage || movie.movieImage,
//           movieLink: data?.movieLink || movie.movieLink,
//           mostViewed: data?.mostViewed || movie.mostViewed,
//           updated_at: new Date().toISOString(), // تحديث updated_at عند التعديل
//         };
//       }
//       return movie;
//     });

//     // كتابة التحديثات إلى ملف CSV
//     writeMoviesToCSV(updatedMovies);

//     const updatedMovie = updatedMovies.find(
//       (movie) => movie.id === id || movie.movieName === movieName
//     );
//     return new Response(JSON.stringify(updatedMovie), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }

// import { v4 as uuidv4 } from 'uuid';
// import fs from 'fs';
// import path from 'path';
// import Papa from 'papaparse';

// // دالة لقراءة ملف movies.csv
// const readMoviesFromCSV = () => {
//   const filePath = path.join(process.cwd(), 'csv', '/movies.csv'); // تعديل المسار حسب مكان الملف
//   const fileContent = fs.readFileSync(filePath, 'utf8');

//   const { data: movies } = Papa.parse(fileContent, {
//     header: true, // تحديد أن الصف الأول هو العناوين
//     skipEmptyLines: true,
//   });

//   return movies;
// };

// // دالة لكتابة البيانات إلى ملف movies.csv
// const writeMoviesToCSV = (movies) => {
//   const filePath = path.join(process.cwd(), 'csv', '/movies.csv');
//   const csv = Papa.unparse(movies);
//   fs.writeFileSync(filePath, csv, 'utf8');
// };

// export async function GET(req) {
//   const url = new URL(req.url);
//   const searchParams = url.searchParams;
//   const page = parseInt(searchParams.get('page')) || 1;
//   const limit = parseInt(searchParams.get('limit')) || 4;
//   const skip = (page - 1) * limit;
//   const movieName = searchParams.get('movieName') || '';
//   const mostViewed = searchParams.get('mostViewed') === 'true'; // تحويل إلى Boolean

//   try {
//     const movies = readMoviesFromCSV();

//     // البحث عن فيلم معين بناءً على الاسم
//     if (movieName) {
//       const filteredMovies = movies.filter((movie) =>
//         movie.movieName.toLowerCase().includes(movieName.toLowerCase())
//       );
//       return new Response(JSON.stringify(filteredMovies), {
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     // إذا كانت قيمة mostViewed true، قم بترتيب الأفلام حسب updated_at
//     // وإذا كانت false، قم بترتيب الأفلام بشكل عشوائي
//     if (mostViewed) {
//       movies.sort(
//         (a, b) => new Date(a['updated_at']) - new Date(b['updated_at'])
//       );
//     } else {
//       movies.sort(() => Math.random() - 0.5); // ترتيب عشوائي
//     }

//     // عرض الأفلام بالترتيب بناءً على mostViewed أو الترتيب العشوائي
//     const paginatedMovies = movies.slice(skip, skip + limit);
//     return new Response(JSON.stringify(paginatedMovies), {
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }

// export async function POST(req) {
//   try {
//     const { movieName, movieImage, movieLink } = await req.json();

//     // قراءة الأفلام الحالية
//     const movies = readMoviesFromCSV();

//     // إضافة فيلم جديد
//     const newMovie = {
//       id: uuidv4(),
//       movieName,
//       movieImage,
//       movieLink,
//       mostViewed: false,
//       created_at: new Date().toISOString(), // إضافة created_at
//       updated_at: new Date().toISOString(), // إضافة updated_at
//     };

//     movies.push(newMovie);

//     // كتابة البيانات إلى ملف CSV
//     writeMoviesToCSV(movies);

//     return new Response(JSON.stringify(newMovie), {
//       status: 201,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }

// export async function PUT(req) {
//   try {
//     const { id, ...data } = await req.json(); // الحصول على البيانات المرسلة
//     const url = new URL(req.url);
//     const movieName = url.searchParams.get('movieName'); // استخراج movieName من معلمات البحث

//     // قراءة الأفلام الحالية
//     const movies = readMoviesFromCSV();

//     // تحديث الفيلم بناءً على id أو movieName
//     const updatedMovies = movies.map((movie) => {
//       if (movie.id === id || (movieName && movie.movieName === movieName)) {
//         return {
//           ...movie,
//           movieName: data?.movieName || movie.movieName,
//           movieImage: data?.movieImage || movie.movieImage,
//           movieLink: data?.movieLink || movie.movieLink,
//           mostViewed: data?.mostViewed || movie.mostViewed,
//           updated_at: new Date().toISOString(), // تحديث updated_at عند التعديل
//         };
//       }
//       return movie;
//     });

//     // كتابة التحديثات إلى ملف CSV
//     writeMoviesToCSV(updatedMovies);

//     const updatedMovie = updatedMovies.find(
//       (movie) => movie.id === id || movie.movieName === movieName
//     );
//     return new Response(JSON.stringify(updatedMovie), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
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
//   const limit = parseInt(searchParams.get('limit')) || 4;
//   const skip = (page - 1) * limit;
//   const movieName = searchParams.get('movieName') || '';
//   const mostViewed = searchParams.get('mostViewed') || false;

//   console.log('movieName', movieName);
//   // console.log(page, limit, skip);

//   try {
//     if (movieName) {
//       let { data: movie, error: createError } = await supabase1
//         .from('movies')
//         .select('*')
//         .ilike('movieName', movieName);

//       // console.log('movie', movie);

//       if (createError) {
//         throw createError;
//       }

//       return Response.json(movie);
//     }
//     if (mostViewed) {
//       let { data: movies, error: createError } = await supabase1
//         .from('movies')
//         .select('*')
//         .range(skip, skip + limit - 1)
//         .order('updated_at', { ascending: true })
//         .eq('mostViewed', mostViewed);
//       // console.log('moviesMostViewed', movies);

//       if (createError) {
//         throw createError;
//       }

//       return Response.json(movies);
//     }

//     let { data: movies, error: createError } = await supabase1
//       .from('movies')
//       .select('*')
//       .range(skip, skip + limit)
//       .order('updated_at', { ascending: false });
//     // console.log('movies', movies);
//     if (createError) {
//       throw createError;
//     }

//     return Response.json(movies);
//   } catch (error) {
//     console.error(error);
//     return Response.json({ error: error.message });
//   }
// }

// export async function POST(req) {
//   const { movieName, movieImage, movieLink } = await req?.json();

//   // console.log(movieName, movieImage, movieLink);

//   try {
//     const { data: movie, error: createError } = await supabase1
//       .from('movies')
//       .insert([{ movieName, movieImage, movieLink }])
//       .select();

//     // console.log(movieName, movieImage);
//     if (createError) {
//       throw createError;
//     }

//     return Response.json(movie);
//   } catch (error) {
//     console.error(error);
//     return new Response(stringify.json({ error: error?.message }), {
//       status: 500,
//     });
//   }
// }

// export async function PUT(req) {
//   try {
//     const { id, ...data } = await req.json(); // الحصول على البيانات المرسلة في الجسم
//     const url = new URL(req.url);
//     const searchParams = url.searchParams;
//     const movieName = searchParams.get('movieName'); // استخراج movieName من معلمات البحث
//     // console.log('id', id);
//     // console.log('movieName', movieName);
//     console.log(data?.movieName);
//     console.log(data?.movieImage);
//     console.log(data?.movieLink);
//     console.log(id);
//     // تحديث الفيلم بناءً على id

//     // تحديث الفيلم بناءً على movieName
//     if (movieName && id) {
//       // console.log('movieName', movieName);

//       const { data: movie, error: updateError } = await supabase1
//         .from('movies')
//         .update({
//           movieName: data?.movieName || null,
//           movieImage: data?.movieImage || null,
//           movieLink: data?.movieLink || null,
//         }) // تحديث البيانات المطلوبة
//         .eq('id', id) // تحديد الفيلم بناءً على movieName
//         .select();

//       if (updateError) {
//         throw new Error(updateError.message);
//       }

//       return new Response(JSON.stringify(movie), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     if (id) {
//       const { data: movie, error: updateError } = await supabase1
//         .from('movies')
//         .update({ mostViewed: true }) // تعيين القيمة المطلوبة لـ mostViewed
//         .eq('id', id) // تحديد الفيلم بناءً على id
//         .select();

//       if (updateError) {
//         throw new Error(updateError.message);
//       }

//       return new Response(JSON.stringify(movie), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }
