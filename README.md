# 🌿 Website Dodod Saketi

Dodod Saketi — a news and information portal for the Saketi community, Pandeglang, Banten (Indonesia). Built with HTML, JavaScript, and a lightweight Python server. Deployed via GitHub Pages.

Portal berita dan informasi terpercaya untuk masyarakat Saketi, Pandeglang, Banten.

## 📁 Struktur File

```
Web Dodod/
├── index.html              # Halaman utama dengan sistem login admin
├── detail-berita.html       # Halaman detail artikel berita
├── semua-berita.html        # Halaman daftar semua berita
├── server.py               # Server Python untuk development
├── jalankan-server.bat     # Script untuk menjalankan server (Windows)
└── README.md              # File dokumentasi ini
```

## 🚀 Cara Menjalankan Website

### Metode 1: Menggunakan Server Lokal (Direkomendasikan)

1. **Double-click** file `jalankan-server.bat`
2. Website akan terbuka otomatis di browser
3. URL: `http://localhost:8000`

### Metode 2: Manual dengan Python

1. Buka Command Prompt atau PowerShell
2. Navigate ke folder `Web Dodod`
3. Jalankan: `python server.py`
4. Buka browser dan kunjungi: `http://localhost:8000`

### Metode 3: Buka File Langsung (Fungsi Terbatas)

- Double-click `index.html` untuk membuka langsung di browser
- ⚠️ **Catatan**: Navigasi antar halaman mungkin tidak berfungsi sempurna

## ✨ Fitur Website

### 🏠 Halaman Utama (index.html)
- Hero section dengan informasi utama
- Portal berita dengan berita terkini
- Fitur posting berita (khusus admin)
- Sistem login admin
- Social media links (Instagram, TikTok, YouTube)

### 👤 Sistem Admin
- **Login Credentials:**
  - Username: `admin` | Password: `admin123`
  - Username: `dodod_admin` | Password: `saketi2025`
  - Username: `superadmin` | Password: `dodod@2025`

- **Fitur Admin:**
  - Dashboard dengan statistik
  - Tambah berita baru
  - Kelola konten website

### 📰 Halaman Berita
- **Semua Berita**: Daftar lengkap dengan filter dan pencarian
- **Detail Berita**: Artikel lengkap dengan komentar dan sharing
- **Kategori**: Berita Utama, Pengumuman, Acara, Pembangunan, Kesehatan, Pendidikan

## 🎨 Teknologi Yang Digunakan

- **HTML5** - Struktur halaman
- **CSS3** - Styling dan animasi
- **Bootstrap 5** - Framework responsive
- **JavaScript** - Interaktivitas
- **Font Awesome** - Icon library
- **Python** - Server development (opsional)

## 📱 Responsive Design

Website ini fully responsive dan dapat diakses dengan baik di:
- 💻 Desktop
- 📱 Mobile phone
- 📟 Tablet

## 🎯 Fitur Utama

### 🔍 Pencarian & Filter
- Pencarian berita real-time
- Filter berdasarkan kategori
- Sorting berdasarkan tanggal/popularitas

### 💬 Interaksi
- Sistem komentar
- Social media sharing
- Newsletter subscription

### 🔐 Keamanan
- Login system untuk admin
- Validasi form
- Protection untuk posting berita

## 🛠️ Pengembangan Lebih Lanjut

Untuk mengembangkan website ini lebih lanjut, Anda bisa:

1. **Backend Database**
   - Implementasi MySQL/PostgreSQL
   - API untuk CRUD operations
   - User management system

2. **CMS (Content Management System)**
   - Admin panel yang lebih lengkap
   - Media upload system
   - SEO optimization

3. **Fitur Tambahan**
   - Push notifications
   - RSS feeds
   - Email newsletters
   - Analytics integration

## 📞 Support

Jika mengalami masalah atau butuh bantuan:
1. Pastikan Python sudah terinstall
2. Cek apakah port 8000 tidak digunakan aplikasi lain
3. Restart server jika ada perubahan pada file

## 📄 License

© 2025 Dodod Saketi. All rights reserved.

---

**Selamat menggunakan Website Dodod Saketi!** 🌿
