# 🍽️ Madangae API

REST API untuk platform Madangae, menyediakan layanan CRUD menu makanan, manajemen user, serta autentikasi berbasis JWT.

## 📦 Fitur
- CRUD data menu makanan
- Registrasi & Login user menggunakan JWT
- Role-based access control untuk User & Admin
- Proteksi keamanan API:
  - Input validation (`express-validator`)
  - XSS protection (`xss-clean`)
  - NoSQL injection protection (`mongo-sanitize`)
  - Rate limiting (`express-rate-limit`)
  - CORS & Error handling
  - Middleware CSRF (belum aktif di semua endpoint)
