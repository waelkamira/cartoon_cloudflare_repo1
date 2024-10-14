// import bcrypt from 'bcryptjs';
import { supabase } from '../../../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
export const runtime = 'edge';
// export async function POST(req) {
//   try {
//     const { name, email, password } = await req.json();

//     // Check if the user already exists
//     const { data: existingUser, error: existError } = await supabase
//       .from('User')
//       .select('*')
//       .eq('email', email)
//       .single();

//     if (existError && existError.code !== 'PGRST116') {
//       // إذا كان الخطأ ليس بسبب عدم وجود المستخدم
//       throw existError;
//     }

//     if (existingUser) {
//       throw new Error(
//         'هذا الايميل موجود بالفعل قم بتسجيل الدخول او استخدم بريد الكتروني أخر'
//       );
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user
//     const { data: user, error: createError } = await supabase
//       .from('User')
//       .insert([
//         {
//           id: uuidv4(),
//           name,
//           email,
//           password: hashedPassword,
//           image:
//             'https://res.cloudinary.com/dh2xlutfu/image/upload/v1722957470/cooking/q9s2dvz8slw43lnyl0gf.png',
//         },
//       ])
//       .single();

//     if (createError) {
//       throw createError;
//     }

//     return new Response(JSON.stringify(user), { status: 201 });
//   } catch (error) {
//     console.error('Error creating user:', error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//     });
//   }
// }
