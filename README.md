# 🚀 WazzLife - Personal Productivity & Finance Tracker

Aplikasi web modern untuk mengelola keuangan, produktivitas, dan kehidupan sehari-hari dalam satu platform terintegrasi.

![WazzLife Dashboard](https://via.placeholder.com/800x400?text=WazzLife+Dashboard)

## ✨ Fitur Utama

### 💰 Manajemen Keuangan
- **Keuangan**: Catat transaksi pemasukan dan pengeluaran dengan kategori
- **Budgeting**: Atur batas anggaran per kategori dan pantau penggunaannya
- **Tabungan**: Tetapkan target tabungan dengan estimasi waktu pencapaian

### 📋 Produktivitas
- **To-Do List**: Kelola tugas dengan prioritas dan tenggat waktu
- **Goal Planner**: Rencanakan tujuan besar dengan milestone terstruktur
- **Habit Tracker**: Bangun kebiasaan baik dengan tracking konsistensi
- **Kalender**: Kelola jadwal dan pengingat acara penting

### 📝 Catatan & Jurnal
- **Notes**: Simpan catatan, ide, atau pengingat bebas
- **Journal**: Abadikan momen penting dengan foto dan caption

### 🎯 Dashboard
- Ringkasan keuangan bulanan
- Statistik produktivitas
- Progress target dan habit
- Jadwal mendatang

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) via [Neon](https://neon.tech/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **File Storage**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- **Deployment**: [Vercel](https://vercel.com/)

## 📦 Instalasi & Setup Lokal

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- PostgreSQL database (Neon.tech recommended)

### Langkah Instalasi

1. **Clone repository**
```bash
git clone https://github.com/Wazzified/wazzlife.git
cd wazzlife

Install dependencies
npm install

Setup Environment Variables
Buat file .env di root project:
# Database
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=verify-full"

# Authentication
AUTH_SECRET="your-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Vercel Blob (untuk upload foto journal)
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

Setup Database
# Generate Prisma Client
npx prisma generate

# Push schema ke database
npx prisma db push

Buka http://localhost:Kalian di browser.
🌐 Deployment
Deploy ke Vercel
Push code ke GitHub
Import project di Vercel Dashboard
Setup environment variables di Vercel
Deploy!
Environment Variables di Vercel
DATABASE_URL: Connection string dari Neon
AUTH_SECRET: Secret key untuk NextAuth
NEXTAUTH_URL: URL production (misal: https://wazzlife.vercel.app)
BLOB_READ_WRITE_TOKEN: Token dari Vercel Blob
👤 User Roles
Admin
Akses penuh ke semua fitur
Bisa create, edit, delete data
Demo
Hanya bisa melihat data
Form dan tombol aksi terkunci
Cocok untuk preview/demo
Default Credentials:
Admin: admin/ admin123
Demo: demo/ demo123
📁 Struktur Project
wazzlife/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Authentication pages
│   │   ├── dashboard/       # Dashboard page
│   │   ├── expense/         # Keuangan
│   │   ├── budget/          # Budgeting
│   │   ├── goals/           # Tabungan
│   │   ├── todo/            # To-Do List
│   │   ├── goal/            # Goal Planner
│   │   ├── calendar/        # Kalender
│   │   ├── habit/           # Habit Tracker
│   │   ├── notes/           # Notes
│   │   ├── journal/         # Journal
│   │   ├── action/          # Server Actions
│   │   ├── api/             # API Routes
│   │   └── layout.tsx       # Root Layout
│   ├── components/          # Reusable components
│   ├── lib/                 # Utilities & configs
│   └── generated/           # Prisma generated client
├── prisma/
│   └── schema.prisma        # Database schema
├── public/                  # Static assets
└── package.json

🎨 Features Highlight
✅ Responsive Design - Mobile-first, works on all devices
✅ Dark Mode Ready - Clean and modern UI
✅ Real-time Updates - Optimistic UI updates
✅ Role-based Access - Admin & Demo modes
✅ File Upload - Journal photo upload with Vercel Blob
✅ Progress Tracking - Visual progress bars & charts
✅ Fast Performance - Next.js 16 with Turbopack

⭐ Star this repo if you find it useful!

---

## 2. Push ke GitHub

```bash
# Initialize git (kalau belum)
git init

# Add semua file
git add .

# Commit
git commit -m "Initial commit: WazzLife - Personal Productivity & Finance Tracker"

# Add remote (ganti USERNAME sama username GitHub lo)
git remote add origin https://github.com/YOUR_USERNAME/wazzlife.git

# Push ke main branch
git branch -M main
git push -u origin main

Bikin Tag/Release
# Bikin tag v1.0.0
git tag -a v1.0.0 -m "Release v1.0.0 - Initial Release"

# Push tag ke GitHub
git push origin v1.0.0

Terus di GitHub:
Buka repo lo
Klik "Releases" di kanan
Klik "Draft a new release"
Pilih tag v1.0.0
Title: WazzLife v1.0.0 - Initial Release
Description: Copy dari README atau bikin summary
Klik "Publish release"

Jangan Lupa .gitignore
Pastiin file .gitignore lo ada ini:
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/

# Production
build/

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Prisma
src/generated/