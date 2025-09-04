// Nama cache (gunakan versi agar mudah diperbarui)
const CACHE_NAME = 'perfume-stock-cache-v1';

// Daftar file dan sumber daya yang perlu di-cache agar aplikasi bisa berjalan offline
const URLS_TO_CACHE = [
  '/', // Ini akan merujuk ke index.html di root
  '/index.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js'
];

// Event 'install': Dipicu saat service worker pertama kali diinstal
self.addEventListener('install', (event) => {
  // Tunggu hingga proses caching selesai
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache dibuka');
        // Menambahkan semua URL yang ditentukan ke dalam cache
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Event 'fetch': Dipicu setiap kali aplikasi meminta sumber daya (misalnya, file, gambar, data)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // Coba cari permintaan di cache terlebih dahulu
    caches.match(event.request)
      .then((response) => {
        // Jika permintaan ditemukan di cache, kembalikan dari cache
        if (response) {
          return response;
        }
        // Jika tidak ada di cache, coba ambil dari jaringan (internet)
        return fetch(event.request);
      })
  );
});

// Event 'activate': Dipicu saat service worker diaktifkan
// Berguna untuk membersihkan cache lama jika ada versi baru
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Hapus cache yang tidak ada di whitelist (cache versi lama)
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
