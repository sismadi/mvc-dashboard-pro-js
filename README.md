# MVC Dashboard Pro JS

Dashboard administrasi modern yang dibangun menggunakan arsitektur **MVC (Model-View-Controller)** sederhana dengan **Vanilla JavaScript**. Proyek ini menekankan pada performa tinggi tanpa dependensi eksternal (Tanpa jQuery, Tanpa Bootstrap).

## ✨ Fitur Utama

* **Custom DataTable:** * Limit baris per halaman (5, 10, 25, 50, 100).
    * Pencarian data real-time tanpa kehilangan fokus input.
    * Pagination informatif (contoh: `1/2 total data 7`).
    * Bulk action melalui checkbox dan menu burger (Delete, Print, Download, Upload).
* **Arsitektur MVC:** Pemisahan logika data (`ui.json`), template (`ui.html`), dan kontroler (`ui.js`).
* **Drawer System:** Form edit data yang muncul dari samping (Drawer) untuk pengalaman pengguna yang mulus.
* **Responsive Layout:** Sidebar yang adaptif untuk tampilan Desktop, Tablet (Top Menu), dan Mobile (Bottom Menu).
* **Dynamic Tabs:** Sistem tab konten yang ringan dan cepat.

## 🚀 Cara Penggunaan

1. **Clone repositori:**
```bash
   git clone [https://github.com/username/mvc-dashboard-pro-js.git](https://github.com/username/mvc-dashboard-pro-js.git)
```


2. **Jalankan melalui Local Server:**
Karena proyek ini menggunakan `fetch()` untuk memuat file JSON dan HTML, Anda harus menjalankannya melalui server (misal: Live Server di VS Code atau Python `http.server`).
```bash
# Contoh menggunakan Python
python -m http.server 8000
```


3. **Buka di Browser:**
Akses 
```bash
`http://localhost:8000`
```

## 📂 Struktur File

* `index.html`: Struktur utama dan inisialisasi aplikasi.
* `ui.js`: Logika kontroler, manipulasi DOM, dan state management untuk tabel.
* `ui.html`: Kumpulan template (Header, Cards, Progress, Table, Menu).
* `ui.css`: Desain responsif dan styling komponen dashboard.
* `ui.json`: Sumber data dummy untuk profil, statistik, dan tabel.

## 🛠️ Teknologi yang Digunakan

* **HTML5 & CSS3** (Custom Properties & Flexbox).
* **Vanilla JavaScript** (ES6+).
* **DOMParser API** untuk pemrosesan template.

## 📝 Lisensi

Proyek ini dibuat untuk tujuan pembelajaran dan pengembangan dashboard internal yang ringan.
