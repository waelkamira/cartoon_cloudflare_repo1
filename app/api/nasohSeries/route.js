import Papa from 'papaparse';
export const runtime = 'edge';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const limit = parseInt(searchParams.get('limit')) || 3; // عدد الحلقات في كل دفعة
    const page = parseInt(searchParams.get('page')) || 1; // رقم الصفحة

    // جلب ملف CSV من GitHub
    const response = await fetch(
      'https://raw.githubusercontent.com/waelkamira/csv/refs/heads/main/episodes.csv'
    );

    // التحقق من أن الطلب كان ناجحاً
    if (!response.ok) {
      throw new Error('Failed to fetch CSV file');
    }

    const fileContent = await response.text(); // قراءة محتوى الملف كـ نص

    // تحليل محتوى CSV باستخدام PapaParse
    const parsedData = Papa.parse(fileContent, { header: true });

    // تصفية الحلقات حسب المسلسل "عائلة نصوح"
    const allEpisodes = parsedData.data.filter(
      (episode) => episode.seriesName === 'عائلة نصوح'
    );

    // حساب الفهرس لبدء العرض
    const startIndex = (page - 1) * limit;
    const paginatedEpisodes = allEpisodes.slice(startIndex, startIndex + limit);

    // إذا لم يتم العثور على أي حلقات
    if (paginatedEpisodes.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No episodes found for عائلة نصوح' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // إرجاع الحلقات المطلوبة
    return new Response(JSON.stringify(paginatedEpisodes), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // التعامل مع أي خطأ أثناء جلب البيانات أو تحليلها
    console.error('Error fetching episodes:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
