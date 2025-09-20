yap
ChatGPT said:

Harika! O zaman sana bu projeyi React + Tailwind + Mantine + pnpm ile adım adım geliştirebileceğin bir “maddeler hâlinde iş akışı” hazırladım. Bunu direkt olarak kursör ile takip ederek kodlamaya başlayabilirsin.

Adım Adım İş Akışı: Sosyal Arkadaş / Etkinlik Sitesi
1. Projeyi Başlatma

pnpm ile React projesi oluştur:

pnpm create react-app social-friends


TailwindCSS kurulumunu yap:

pnpm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p


Tailwind yapılandırmasını tailwind.config.js ile ayarla.

Mantine paketlerini yükle:

pnpm install @mantine/core @mantine/hooks @mantine/form

2. Dosya ve Dizin Yapısını Oluştur
/src
  /components
    Navbar.jsx
    Sidebar.jsx
    EventCard.jsx
    ProfileCard.jsx
    AuthForm.jsx
  /pages
    Home.jsx
    Profile.jsx
    EventCreate.jsx
    FriendSearch.jsx
    Login.jsx
    Register.jsx
  /context
    AuthContext.jsx
  /api
    mockAPI.js
  App.jsx
  index.jsx

3. Authentication (Giriş/Kayıt)

Mantine Form kullanarak Login.jsx ve Register.jsx oluştur.

Email ve şifre ile doğrulama ekle.

Context API veya useState ile auth durumunu yönet:

Kullanıcı giriş yaptıysa Home sayfasına yönlendir.

Şifre unutma ve sıfırlama opsiyonel.

4. Navbar ve Layout

Mantine Navbar komponenti oluştur.

Navbar’da: Home, Profil, Etkinlik Paylaş, Arkadaş Arama linkleri.

Responsive tasarım için Tailwind sınıfları kullan (flex, grid, sm/md/lg).

5. Home Sayfası (Etkinlik Akışı)

EventCard.jsx ile her etkinliği kart olarak göster.

EventCard: başlık, açıklama, tarih, lokasyon, kullanıcı adı.

Mock API veya backend ile etkinlikleri çek.

Tailwind ile kart tasarımını yap (shadow, rounded, hover efektleri).

6. Profil Sayfası

Profile.jsx sayfası oluştur.

Kullanıcı bilgilerini ve etkinliklerini göster.

Profil düzenleme: Mantine form kullan, Tailwind ile stillendir.

7. Etkinlik Paylaşımı

EventCreate.jsx sayfası oluştur.

Form alanları: Başlık (TextInput), Açıklama (Textarea), Tarih (DatePicker), Lokasyon (TextInput/Autocomplete).

Formu gönderdiğinde mockAPI veya backend’e kaydet.

Başarılı ekleme sonrası Home sayfasına yönlendir.

8. Arkadaş Arama / Bağlantı

FriendSearch.jsx sayfası oluştur.

Kullanıcıları ve etkinlikleri arama ve filtreleme (lokasyon, tarih, ilgi alanı).

ProfileCard veya EventCard üzerinden arkadaş ekleme veya mesaj atma butonları.

9. State Yönetimi

Auth durumu: AuthContext.jsx

Kullanıcı verileri ve etkinlik listesi: Context veya useState

Büyük projelerde Redux veya Zustand düşünülebilir.

10. Responsive ve Stil

TailwindCSS ile tüm sayfaları mobil ve web uyumlu yap.

Hover, transition, shadow ve rounded efektlerini ekle.

Mantine ile modal veya buton tasarımlarını uygula.

11. Test ve Yayın

React Testing Library veya Jest ile component testleri yaz.

Mobil uyumluluk testleri yap.

Yayın: Vercel (Next.js) veya Netlify (React).