import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid'; // استيراد مكتبة uuid
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
export const runtime = 'edge';
// إعداد Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL1,
  process.env.NEXT_PUBLIC_SUPABASE_API1
);

export const authOptions = {
  cookies: {
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
  secret: process.env.NEXT_PUBLIC_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: 'consent', // لجعل نافذة تسجيل الدخول تظهر مباشرة
          access_type: 'offline',
          include_granted_scopes: true,
        },
      },
    }),
    // لجعل العملية أسرع Credentials قمت بالغاء التسجيل عن طريق ال
    // CredentialsProvider({
    //   name: 'credentials',
    //   credentials: {
    //     name: { label: 'Your name', type: 'text', placeholder: 'Your name' },
    //     email: {
    //       label: 'Your email',
    //       type: 'email',
    //       placeholder: 'Your email',
    //     },
    //     password: {
    //       label: 'Your password',
    //       type: 'password',
    //       placeholder: 'Your password',
    //     },
    //   },
    //   async authorize(credentials) {
    //     const email = credentials?.email;
    //     const password = credentials?.password;

    //     const { data: user, error } = await supabase
    //       .from('User')
    //       .select('*')
    //       .eq('email', email)
    //       .single();

    //     if (error || !user) {
    //       throw new Error('Email not found');
    //     }

    //     const checkPassword = await bcrypt.compare(password, user.password);

    //     if (!checkPassword) {
    //       throw new Error('Incorrect password');
    //     }
    //     console.log('user', user);
    //     // يجب أن تُرجع كائن المستخدم
    //     return {
    //       id: user.id,
    //       email: user.email,
    //       name: user.name,
    //     };
    //   },
    // }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === 'google') {
        const { data: existingUser, error: existingUserError } = await supabase
          .from('User')
          .select('*')
          .eq('email', profile.email)
          .single();

        if (existingUserError && existingUserError.code !== 'PGRST116') {
          throw new Error(existingUserError.message);
        }

        if (!existingUser) {
          // إنشاء id جديد باستخدام uuid
          const newId = uuidv4();

          const { error } = await supabase.from('User').insert({
            // id: newId, // إضافة id جديد
            email: profile.email,
            name: profile.name,
            image: profile.picture,
            googleId: profile.sub,
          });

          if (error) {
            throw new Error(error.message);
          }
        } else {
          if (!existingUser.googleId) {
            const { error } = await supabase
              .from('User')
              .update({ googleId: profile.sub })
              .eq('email', profile.email);

            if (error) {
              throw new Error(error.message);
            }
          }
        }

        return true;
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl || '/'; // يعيد التوجيه دائمًا إلى الصفحة الرئيسية أو إلى الصفحة المحددة
    },
  },

  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
  pages: {
    // signIn: '/api/auth/signin',
    // signOut: '/api/auth/signout',
    error: '/auth/error', // Custom error page
  },
};
