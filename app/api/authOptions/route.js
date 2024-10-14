import bcrypt from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import Papa from 'papaparse';
export const runtime = 'edge';
const readUsersFromCSV = async () => {
  try {
    // تحميل محتوى ملف User.csv من URL باستخدام fetch
    const response = await fetch(
      'https://raw.githubusercontent.com/waelkamira/csv/refs/heads/main/User.csv'
    );

    // التأكد من أن الاستجابة كانت ناجحة
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.text(); // قراءة البيانات كنص

    // تحليل البيانات باستخدام PapaParse
    const { data: users } = Papa.parse(data, {
      header: true, // يتوقع أن يكون أول صف كعناوين
      skipEmptyLines: true,
    });

    return users; // إرجاع بيانات المستخدمين
  } catch (error) {
    console.error('Error fetching users from CSV:', error);
    return []; // إرجاع مصفوفة فارغة في حال حدوث خطأ
  }
};

export const authOptions = {
  secret: process.env.NEXT_PUBLIC_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Your email',
          type: 'email',
          placeholder: 'Your email',
        },
        password: {
          label: 'Your password',
          type: 'password',
          placeholder: 'Your password',
        },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        // قراءة بيانات المستخدمين من ملف CSV
        const users = await readUsersFromCSV();

        // البحث عن المستخدم بناءً على البريد الإلكتروني
        const user = users.find((u) => u.email === email);

        // التحقق من وجود المستخدم
        if (!user) {
          throw new Error('Email not found');
        }

        // التحقق من كلمة المرور
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
          throw new Error('Incorrect password');
        }

        return user; // إرجاع المستخدم عند نجاح التحقق
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub; // إضافة معرف المستخدم للجلسة
      return session;
    },
    async signIn({ account, profile }) {
      return true; // يمكنك إضافة منطق لتسجيل الدخول عبر Google إذا كان لديك
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token; // إضافة رمز الوصول للجلسة
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  session: {
    strategy: 'jwt', // استخدام JWT للجلسات
  },
  debug: process.env.NODE_ENV === 'development', // تفعيل وضع التصحيح في بيئة التطوير
  pages: { signIn: '/login' }, // تخصيص صفحة تسجيل الدخول
};

// // import { createClient } from '@supabase/supabase-js';
//  export const runtime = 'edge';
// import bcrypt from 'bcryptjs';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import GoogleProvider from 'next-auth/providers/google';
// import fs from 'fs';
// import path from 'path';
// import Papa from 'papaparse';

// // إعداد Supabase (للبقاء على التوافق مع الكود الحالي، لكن لن تستخدمه بعد الآن)
// // const supabase = createClient(
// //   process.env.NEXT_PUBLIC_SUPABASE_URL,
// //   process.env.NEXT_PUBLIC_SUPABASE_API
// // );

// const readUsersFromCSV = () => {
//   // قراءة ملف User.csv
//   const filePath = path.join(process.cwd(), 'csv', '/User.csv'); // قم بتعديل المسار حسب مكان وجود ملف CSV
//   const fileContent = fs.readFileSync(filePath, 'utf8');

//   // استخدام PapaParse لتحليل البيانات
//   const { data: users } = Papa.parse(fileContent, {
//     header: true, // يتوقع أن يكون أول صف كعناوين
//     skipEmptyLines: true,
//   });

//   return users; // إرجاع بيانات المستخدمين
// };

// export const authOptions = {
//   secret: process.env.NEXT_PUBLIC_SECRET,
//   providers: [
//     GoogleProvider({
//       clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//       clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
//       allowDangerousEmailAccountLinking: true,
//     }),
//     CredentialsProvider({
//       name: 'credentials',
//       credentials: {
//         email: {
//           label: 'Your email',
//           type: 'email',
//           placeholder: 'Your email',
//         },
//         password: {
//           label: 'Your password',
//           type: 'password',
//           placeholder: 'Your password',
//         },
//       },
//       async authorize(credentials) {
//         const email = credentials?.email;
//         const password = credentials?.password;
//         // console.log('email', email);
//         // console.log('password', password);
//         // قراءة بيانات المستخدمين من ملف CSV
//         const users = readUsersFromCSV();
//         // console.log('users', users);

//         // البحث عن المستخدم بناءً على البريد الإلكتروني
//         const user = users.find((u) => u.email === email);

//         // التحقق من وجود المستخدم
//         if (!user) {
//           throw new Error('Email not found');
//         }

//         // التحقق من كلمة المرور
//         const checkPassword = await bcrypt.compare(password, user.password);
//         if (!checkPassword) {
//           throw new Error('Incorrect password');
//         }

//         return user; // إرجاع المستخدم عند نجاح التحقق
//       },
//     }),
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       session.user.id = token.sub; // إضافة معرف المستخدم للجلسة
//       return session;
//     },
//     async signIn({ account, profile }) {
//       // يمكنك إضافة منطق لتسجيل الدخول عبر Google إذا كان لديك
//       return true;
//     },
//     async jwt({ token, account }) {
//       if (account) {
//         token.accessToken = account.access_token; // إضافة رمز الوصول للجلسة
//       }
//       return token;
//     },
//     async redirect({ url, baseUrl }) {
//       return url.startsWith(baseUrl) ? url : baseUrl;
//     },
//   },
//   session: {
//     strategy: 'jwt', // استخدام JWT للجلسات
//   },
//   debug: process.env.NODE_ENV === 'development', // تفعيل وضع التصحيح في بيئة التطوير
//   pages: { signIn: '/login' }, // تخصيص صفحة تسجيل الدخول
// };

// import { createClient } from '@supabase/supabase-js';
// import bcrypt from 'bcryptjs';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import GoogleProvider from 'next-auth/providers/google';

// // إعداد Supabase
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.NEXT_PUBLIC_SUPABASE_API
// );

// export const authOptions = {
//   secret: process.env.NEXT_PUBLIC_SECRET,
//   providers: [
//     GoogleProvider({
//       clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//       clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
//       allowDangerousEmailAccountLinking: true,
//     }),
//     CredentialsProvider({
//       name: 'credentials',
//       credentials: {
//         name: { label: 'Your name', type: 'text', placeholder: 'Your name' },
//         email: {
//           label: 'Your email',
//           type: 'email',
//           placeholder: 'Your email',
//         },
//         password: {
//           label: 'Your password',
//           type: 'password',
//           placeholder: 'Your password',
//         },
//       },
//       async authorize(credentials) {
//         const email = credentials?.email;
//         const password = credentials?.password;

//         const { data: user, error } = await supabase
//           .from('User')
//           .select('*')
//           .eq('email', email)
//           .single();

//         if (error || !user) {
//           throw new Error('Email not found');
//         }

//         const checkPassword = await bcrypt.compare(password, user.password);

//         if (!checkPassword) {
//           throw new Error('Incorrect password');
//         }

//         return user;
//       },
//     }),
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       session.user.id = token.sub;
//       return session;
//     },
//     async signIn({ account, profile }) {
//       if (account.provider === 'google') {
//         const { data: existingUser, error: existingUserError } = await supabase
//           .from('User')
//           .select('*')
//           .eq('email', profile.email)
//           .single();

//         if (existingUserError && existingUserError.code !== 'PGRST116') {
//           throw new Error(existingUserError.message);
//         }

//         if (existingUser) {
//           if (!existingUser.googleId) {
//             const { error } = await supabase
//               .from('User')
//               .update({ googleId: profile.sub })
//               .eq('email', profile.email);

//             if (error) {
//               throw new Error(error.message);
//             }
//           }
//         } else {
//           const { error } = await supabase.from('User').insert({
//             email: profile.email,
//             name: profile.name,
//             image: profile.picture,
//             googleId: profile.sub,
//           });

//           if (error) {
//             throw new Error(error.message);
//           }
//         }

//         return true;
//       }
//       return true;
//     },
//     async jwt({ token, account }) {
//       if (account) {
//         token.accessToken = account.access_token;
//       }
//       return token;
//     },
//     async redirect({ url, baseUrl }) {
//       return url.startsWith(baseUrl) ? url : baseUrl;
//     },
//   },
//   session: {
//     strategy: 'jwt',
//   },
//   debug: process.env.NODE_ENV === 'development',
//   pages: { signIn: '/login' },
// };
