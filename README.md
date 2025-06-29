# 🍽️ Madangae Web Platform

Madangae adalah platform web berbasis ReactJS & Express.js yang menyediakan informasi menu makanan, resep, dan tutorial pembuatan. Sistem ini terdiri dari:

- **madangae-api** : Backend REST API.
- **madangae-user** : Frontend untuk user umum.
- **madangae-admin** : Frontend untuk admin.

---

## 📌 Deskripsi Aplikasi  

### ⚙️ madangae-api  
REST API berbasis Express.js:
- CRUD data menu & user.
- Autentikasi JWT.
- Proteksi CSRF.
- Validasi input.
- Rate limit & XSS prevention.
- MongoDB sebagai database.

---

## 📦 Instalasi & Jalankan  

### 1️⃣ madangae-api

```bash
cd madangae-api
npm install
npm start
