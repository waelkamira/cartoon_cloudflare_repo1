import Papa from 'papaparse';

export const runtime = 'edge';

// روابط ملفات CSV من GitHub
const csvUrls = {
  User: 'https://raw.githubusercontent.com/waelkamira/csv/refs/heads/main/User.csv',
};

// دالة لجلب وتحليل محتوى CSV
async function fetchCsvData(url) {
  const response = await fetch(url);
  const csvText = await response.text();
  return Papa.parse(csvText, { header: true }).data;
}

// معالجة GET
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '5', 10);
  const searchQuery = searchParams.get('searchQuery') || '';
  const isAdmin = searchParams.get('isAdmin') === 'true';

  try {
    const users = await fetchCsvData(csvUrls.User);

    // تصفية البيانات
    let filteredUsers = users;

    if (searchQuery) {
      filteredUsers = filteredUsers.filter((user) =>
        user.email.includes(searchQuery)
      );
    }

    if (isAdmin) {
      // تطبيق التصفح
      const startIndex = (pageNumber - 1) * limit;
      const paginatedUsers = filteredUsers.slice(
        startIndex,
        startIndex + limit
      );

      return new Response(JSON.stringify(paginatedUsers), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

// معالجة PUT
export async function PUT(req) {
  try {
    const { email, image, name } = await req.json();
    const users = await fetchCsvData(csvUrls.User);

    // تحديث المستخدم
    const userIndex = users.findIndex((user) => user.email === email);
    if (userIndex === -1) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    users[userIndex].image = image;
    users[userIndex].name = name;

    return new Response(JSON.stringify(users[userIndex]), { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

// معالجة DELETE
export async function DELETE(req) {
  try {
    const { email } = await req.json();
    const users = await fetchCsvData(csvUrls.User);

    // التحقق من وجود المستخدم
    const userIndex = users.findIndex((user) => user.email === email);
    if (userIndex === -1) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    // حذف المستخدم
    users.splice(userIndex, 1);

    return new Response(
      JSON.stringify({ message: 'User deleted successfully' }),
      { status: 200 }
    );
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

// const filePath = path.join(process.cwd(), 'csv', 'User.csv'); // تأكد من المسار الصحيح للملف

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const pageNumber = parseInt(searchParams.get('pageNumber') || '1', 10);
//   const limit = parseInt(searchParams.get('limit') || '5', 10);
//   const searchQuery = searchParams.get('searchQuery') || '';
//   const isAdmin = searchParams.get('isAdmin') === 'true';

//   try {
//     const file = fs.readFileSync(filePath, 'utf8');
//     const parsedData = Papa.parse(file, { header: true }).data;

//     // تصفية البيانات
//     let users = parsedData;

//     if (searchQuery) {
//       users = users.filter((user) => user.email.includes(searchQuery));
//     }

//     if (isAdmin) {
//       // تطبيق التصفح
//       const startIndex = (pageNumber - 1) * limit;
//       const paginatedUsers = users.slice(startIndex, startIndex + limit);

//       return new Response(JSON.stringify(paginatedUsers), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
//       status: 500,
//     });
//   }
// }

// export async function PUT(req) {
//   try {
//     const { email, image, name } = await req.json();
//     const file = fs.readFileSync(filePath, 'utf8');
//     const parsedData = Papa.parse(file, { header: true });
//     const users = parsedData.data;

//     // تحديث المستخدم
//     const userIndex = users.findIndex((user) => user.email === email);
//     if (userIndex === -1) {
//       return new Response(JSON.stringify({ error: 'User not found' }), {
//         status: 404,
//       });
//     }

//     users[userIndex].image = image;
//     users[userIndex].name = name;

//     // كتابة البيانات المحدثة إلى ملف CSV
//     const csv = Papa.unparse(users);
//     fs.writeFileSync(filePath, csv);

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
//     const file = fs.readFileSync(filePath, 'utf8');
//     const parsedData = Papa.parse(file, { header: true });
//     const users = parsedData.data;

//     // التحقق من وجود المستخدم
//     const userIndex = users.findIndex((user) => user.email === email);
//     if (userIndex === -1) {
//       return new Response(JSON.stringify({ error: 'User not found' }), {
//         status: 404,
//       });
//     }

//     // حذف المستخدم
//     users.splice(userIndex, 1);

//     // كتابة البيانات المحدثة إلى ملف CSV
//     const csv = Papa.unparse(users);
//     fs.writeFileSync(filePath, csv);

//     return new Response(
//       JSON.stringify({ message: 'User deleted successfully' }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
//       status: 500,
//     });
//   }
// }

// import { supabase } from '../../../lib/supabaseClient';

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const pageNumber = parseInt(searchParams.get('pageNumber') || '1', 10);
//   const limit = parseInt(searchParams.get('limit') || '5', 10);
//   const searchQuery = searchParams.get('searchQuery') || '';
//   const isAdmin = searchParams.get('isAdmin') === 'true';
//   try {
//     if (searchQuery && isAdmin) {
//       let { data: User, error } = await supabase
//         .from('User')
//         .select('*')
//         .like('email', `%${searchQuery}%`) // استخدم like للبحث الجزئي
//         .range((pageNumber - 1) * limit, pageNumber * limit - 1);

//       // console.log('User', User);
//       if (error) throw error;
//       return Response.json(User);
//     } else if (isAdmin) {
//       let { data: User, error } = await supabase
//         .from('User')
//         .select('email')
//         .order('createdAt', { ascending: false })
//         .range((pageNumber - 1) * limit, pageNumber * limit - 1);

//       if (error) throw error;
//       // console.log('User', User);
//       // console.log('User', User?.length);
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
