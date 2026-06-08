# 💰 Tabunganku (ReyMoney)

Aplikasi web sederhana untuk mencatat pemasukan, pengeluaran, dan target tabungan dengan tampilan modern dan grafik interaktif.

---

## 🚀 Demo
> https://tabunganku-six.vercel.app

---

## ✨ Fitur

- 💸 Tambah pemasukan & pengeluaran
- 🏷️ Kategori transaksi
- 📅 Riwayat lengkap (tanggal & jam)
- 🔎 Search & filter transaksi
- 📊 Grafik keuangan (Chart.js)
- 📈 Grafik perkembangan saldo
- 🎯 Target tabungan + progress bar
- 🎨 Theme: Dark / Light / Neon
- 💾 Auto save (LocalStorage)

---

## 🚀 Rencana Pengembangan (Roadmap)

Versi berikutnya akan dikembangkan menjadi aplikasi keuangan yang lebih lengkap:

### 🔐 User System
- Login & register
- Data per user (multi account)

### ☁️ Cloud Database
- Integrasi Supabase / Firebase
- Sinkronisasi antar device

### 📱 PWA (Progressive Web App)
- Bisa di-install seperti aplikasi Android
- Offline mode support

### 📊 Statistik Lanjutan
- Analisis pengeluaran terbesar
- Grafik per bulan & minggu
- Prediksi saldo

### 📄 Export Data
- Export PDF
- Export Excel
- Backup JSON

### 🤖 AI Finance Assistant
- Analisa pengeluaran
- Saran hemat otomatis
- Deteksi pola boros


## 📸 Screenshot

![Preview](assets/preview.png)

Tampilan aplikasi:
- Dashboard keuangan
- Grafik pemasukan & pengeluaran
- Target tabungan
- Riwayat transaksi

## 🛠️ Tech Stack

![HTML](https://img.shields.io/badge/HTML-5-orange)
![CSS](https://img.shields.io/badge/CSS-3-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow)
![Chart.js](https://img.shields.io/badge/Chart.js-DataViz-green)

---

## 💾 Sistem Penyimpanan

Aplikasi ini menggunakan **localStorage browser** untuk menyimpan data.

### Cara kerja:
- Semua transaksi disimpan di browser pengguna
- Data disimpan dalam format JSON
- Tidak membutuhkan server atau database

### Key yang digunakan:
- `rey_money` → menyimpan semua transaksi
- `rey_target` → menyimpan target tabungan

### Contoh struktur data:

```json
{
  "id": 1710000000000,
  "note": "Gaji",
  "amount": 500000,
  "type": "income",
  "category": "Gaji",
  "date": "2026-06-09T01:30:00.000Z",
  "time": "01:30",
  "fullDate": "09 Jun 2026"
}
