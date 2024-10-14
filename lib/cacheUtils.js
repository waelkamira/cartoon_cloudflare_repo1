import NodeCache from 'node-cache';

// إنشاء كائن للتخزين المؤقت
const cache = new NodeCache({ stdTTL: 60 * 10 }); // التخزين لمدة 10 دقائق

export function invalidateCacheByPrefix(prefix) {
  // الحصول على جميع المفاتيح من التخزين المؤقت
  const keys = cache.keys();

  // تصفية المفاتيح التي تبدأ بالبريفكس المحدد
  const keysToInvalidate = keys.filter((key) => key.startsWith(prefix));

  // حذف المفاتيح المصفاة من التخزين المؤقت
  keysToInvalidate.forEach((key) => cache.del(key));
}
