# Ulang Tahun Dwitia

Website ucapan ulang tahun interaktif untuk Dwitia Pratiwi, dibuat dengan Vite, JavaScript, dan Three.js.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka URL yang ditampilkan Vite. Untuk menguji versi produksi:

```bash
npm run build
npm run preview
```

## Mengganti foto

1. Letakkan foto di `public/images` (misalnya `foto-kita.jpg`).
2. Buka `index.html`, lalu ganti nilai `src` pada kartu galeri, misalnya dari `/images/memory-1.svg` menjadi `/images/foto-kita.jpg`.
3. Ubah teks `alt` agar menjelaskan isi foto.

## Deploy ke Vercel

Push proyek ke GitHub/GitLab/Bitbucket, impor repository di Vercel, lalu klik **Deploy**. Vercel akan mendeteksi Vite; konfigurasi build juga tersedia di `vercel.json`. Alternatifnya, jalankan `npx vercel` dari folder proyek.

Musik dibuat secara lokal dengan Web Audio API sehingga tidak membutuhkan file audio, API key, backend, atau layanan berbayar. Musik hanya dimulai setelah tombol ditekan.
