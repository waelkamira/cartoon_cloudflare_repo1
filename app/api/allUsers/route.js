import { createClient } from '@supabase/supabase-js';
export const runtime = 'edge';
// إعداد Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL1, // عنوان URL الخاص بـ Supabase
  process.env.NEXT_PUBLIC_SUPABASE_API1 // مفتاح API العمومي الخاص بـ Supabase
);
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '5', 10);
  const searchQuery = searchParams.get('searchQuery') || '';
  const isAdmin = searchParams.get('isAdmin') === 'true';
  try {
    if (searchQuery && isAdmin) {
      let { data: User, error } = await supabase
        .from('User')
        .select('*')
        .like('email', `%${searchQuery}%`) // استخدم like للبحث الجزئي
        .range((pageNumber - 1) * limit, pageNumber * limit - 1);

      // console.log('User', User);
      if (error) throw error;
      return Response.json(User);
    } else if (isAdmin) {
      let { data: User, error } = await supabase
        .from('User')
        .select('email')
        .order('createdAt', { ascending: false })
        .range((pageNumber - 1) * limit, pageNumber * limit - 1);

      if (error) throw error;
      // console.log('User', User);
      // console.log('User', User?.length);
      return Response.json(User);
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

    const { data: user, error } = await supabase
      .from('User')
      .update({ image, name })
      .eq('email', email)
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(user), { status: 200 });
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

    // التحقق من وجود المستخدم قبل محاولة حذفه
    const { data: existingUser, error: fetchError } = await supabase
      .from('User')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !existingUser) {
      console.error(`User with email ${email} not found.`);
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    const { data: deletedUser, error: deleteError } = await supabase
      .from('User')
      .delete()
      .eq('email', email);

    if (deleteError) throw deleteError;

    return new Response(JSON.stringify(deletedUser), { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
