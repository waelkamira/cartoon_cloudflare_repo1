import Papa from 'papaparse';
export const runtime = 'edge';

// رابط ملف CSV المستضاف على GitHub
const csvUrl =
  'https://raw.githubusercontent.com/USERNAME/REPOSITORY/BRANCH/csv/User.csv';

// إعداد الكاش لتخزين البيانات
const cache = {
  data: null,
  lastUpdated: null,
};

const CACHE_DURATION = 15 * 60 * 1000; // مدة الكاش: 15 دقيقة

// التحقق مما إذا كان الكاش صالحًا
function isCacheValid() {
  return cache.data && Date.now() - cache.lastUpdated < CACHE_DURATION;
}

// دالة لجلب البيانات من ملف CSV على GitHub
async function fetchCSV(url) {
  const response = await fetch(url);
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

// جلب البيانات من الكاش أو من GitHub
async function getDataFromCacheOrGithub() {
  if (isCacheValid()) {
    return cache.data;
  } else {
    const data = await fetchCSV(csvUrl);
    cache.data = data;
    cache.lastUpdated = Date.now();
    return data;
  }
}

// دالة لجلب المستخدم بناءً على البريد الإلكتروني
function findUserByEmail(users, email) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email') || '';

  try {
    const users = await getDataFromCacheOrGithub();

    if (email) {
      const user = findUserByEmail(users, email);
      if (!user) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
          status: 404,
        });
      }
      return new Response(JSON.stringify(user), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify(users), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error fetching User:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    const { email, image, name } = await req.json();
    let users = await getDataFromCacheOrGithub();

    const userIndex = users.findIndex(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (userIndex === -1) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    // تحديث بيانات المستخدم
    users[userIndex].image = image || users[userIndex].image;
    users[userIndex].name = name || users[userIndex].name;

    // تحديث الكاش
    cache.data = users;
    cache.lastUpdated = Date.now();

    // ملاحظة: إذا كنت تريد تحديث ملف CSV على GitHub، استخدم GitHub API هنا

    return new Response(JSON.stringify(users[userIndex]), { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  try {
    const { email } = await req.json();
    let users = await getDataFromCacheOrGithub();

    const userIndex = users.findIndex(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (userIndex === -1) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    // حذف المستخدم
    const deletedUser = users.splice(userIndex, 1);

    // تحديث الكاش
    cache.data = users;
    cache.lastUpdated = Date.now();

    // ملاحظة: إذا كنت تريد حذف المستخدم من ملف CSV على GitHub، استخدم GitHub API هنا

    return new Response(JSON.stringify(deletedUser), { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

// import fs from 'fs';
// import path from 'path';
// import Papa from 'papaparse';
// const filePath = path.join(process.cwd(), 'csv', 'User.csv');

// // دالة لقراءة البيانات من CSV
// function readCSV() {
//   const fileContent = fs.readFileSync(filePath, 'utf8');
//   const parsedData = Papa.parse(fileContent, { header: true });
//   return parsedData.data;
// }

// // دالة لكتابة البيانات إلى CSV
// function writeCSV(data) {
//   const updatedCSV = Papa.unparse(data);
//   fs.writeFileSync(filePath, updatedCSV);
// }

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const email = searchParams.get('email') || '';

//   try {
//     const users = readCSV();

//     if (email) {
//       const user = users.find((u) => u.email === email);
//       if (!user) {
//         return new Response(JSON.stringify({ error: 'User not found' }), {
//           status: 404,
//         });
//       }
//       return new Response(JSON.stringify(user), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     } else {
//       return new Response(JSON.stringify(users), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }
//   } catch (error) {
//     console.error('Error fetching User:', error);
//     return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
//       status: 500,
//     });
//   }
// }

// export async function PUT(req) {
//   try {
//     const { email, image, name } = await req.json();
//     let users = readCSV();

//     const userIndex = users.findIndex((u) => u.email === email);
//     if (userIndex === -1) {
//       return new Response(JSON.stringify({ error: 'User not found' }), {
//         status: 404,
//       });
//     }

//     users[userIndex].image = image;
//     users[userIndex].name = name;

//     writeCSV(users);

//     return new Response(JSON.stringify(users[userIndex]), { status: 200 });
//   } catch (error) {
//     console.error('Error updating user:', error);
//     return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
//       status: 500,
//     });
//   }
// }

// export async function DELETE(req) {
//   try {
//     const { email } = await req.json();
//     let users = readCSV();

//     const userIndex = users.findIndex((u) => u.email === email);
//     if (userIndex === -1) {
//       return new Response(JSON.stringify({ error: 'User not found' }), {
//         status: 404,
//       });
//     }

//     const deletedUser = users.splice(userIndex, 1);

//     writeCSV(users);

//     return new Response(JSON.stringify(deletedUser), { status: 200 });
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
//       status: 500,
//     });
//   }
// }

// import { createClient } from '@supabase/supabase-js';

// // إعداد Supabase Client
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL, // عنوان URL الخاص بـ Supabase
//   process.env.NEXT_PUBLIC_SUPABASE_API // مفتاح API العمومي الخاص بـ Supabase
// );

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const email = searchParams.get('email') || '';

//   // console.log('Full Query String:', req.url);
//   // console.log('email', email);
//   try {
//     if (email) {
//       let { data: User, error } = await supabase
//         .from('User')
//         .select('*')
//         .eq('email', email);
//       if (error) throw error;
//       // console.log('User', User);
//       return Response.json(User);
//     }
//   } catch (error) {
//     console.error('Error fetching User:', error);
//     return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
//       status: 500,
//     });
//   }
// }

// export async function PUT(req) {
//   try {
//     const { email, image, name } = await req.json();

//     const { data: user, error } = await supabase
//       .from('User')
//       .update({ image, name })
//       .eq('email', email)
//       .single();

//     if (error) throw error;

//     return new Response(JSON.stringify(user), { status: 200 });
//   } catch (error) {
//     console.error('Error updating user:', error);
//     return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
//       status: 500,
//     });
//   }
// }

// export async function DELETE(req) {
//   try {
//     const { email } = await req.json();

//     // التحقق من وجود المستخدم قبل محاولة حذفه
//     const { data: existingUser, error: fetchError } = await supabase
//       .from('User')
//       .select('*')
//       .eq('email', email)
//       .single();

//     if (fetchError || !existingUser) {
//       console.error(`User with email ${email} not found.`);
//       return new Response(JSON.stringify({ error: 'User not found' }), {
//         status: 404,
//       });
//     }

//     const { data: deletedUser, error: deleteError } = await supabase
//       .from('User')
//       .delete()
//       .eq('email', email);

//     if (deleteError) throw deleteError;

//     return new Response(JSON.stringify(deletedUser), { status: 200 });
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
//       status: 500,
//     });
//   }
// }
