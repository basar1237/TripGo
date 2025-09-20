// Admin kullanıcıların email listesi
export const ADMIN_EMAILS = [
  'basar1237@gmail.com', // Sizin email adresiniz
  'admin@tripgo.com',    // Genel admin email
  // Buraya admin olmasını istediğiniz email adreslerini ekleyebilirsiniz
  // Örnek: 'yeniadmin@example.com'
];

// Kullanıcının admin olup olmadığını kontrol et
export const isAdmin = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

// Admin yetkisi gerektiren sayfalar
export const ADMIN_ROUTES = [
  '/admin',
  '/admin/dashboard',
  '/admin/users',
  '/admin/analytics'
];
