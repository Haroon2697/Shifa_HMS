# 🏥 Hospital Management System (Shifa HMS)

A comprehensive hospital management system built with Next.js, Supabase, and Tailwind CSS.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/haroon-azizs-projects/v0-hospital-management-system)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/qBlnikKxJvO)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Add your Supabase credentials to .env.local

# Run development server
npm run dev
```

Visit: http://localhost:3000

## 📚 Documentation

**For complete setup instructions, troubleshooting, and user credentials, see:**

👉 **[COMPLETE-SETUP-GUIDE.md](./COMPLETE-SETUP-GUIDE.md)**

## ✨ Features

- **Multi-Role Authentication** - 7 user roles (Admin, Doctor, Nurse, Receptionist, Accountant, Radiologist, Pharmacist)
- **Role-Based Dashboards** - Customized views for each role
- **Patient Management** - Registration, records, and tracking
- **Appointment Scheduling** - Manage patient appointments
- **OPD Consultation** - Outpatient department management
- **Billing & Accounting** - Invoice generation and payment tracking
- **Pharmacy Management** - Medicine inventory and prescriptions
- **Radiology Tests** - Imaging test management
- **Room Management** - Ward and bed tracking
- **OT Scheduling** - Operation theatre scheduling
- **Emergency Cases** - Priority patient handling

## 👥 Test Credentials

**All users password:** `password123`

- Admin: `admin@hospital.com`
- Doctor: `doctor@hospital.com`
- Nurse: `nurse@hospital.com`
- Receptionist: `receptionist@hospital.com`
- Accountant: `accountant@hospital.com`
- Radiologist: `radiologist@hospital.com`
- Pharmacist: `pharmacist@hospital.com`

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Styling:** Tailwind CSS
- **UI Components:** Custom components with shadcn/ui
- **Language:** TypeScript

## 📁 Project Structure

```
hospital-management-system/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── auth/             # Auth components
│   ├── dashboard/        # Dashboard components
│   └── modules/          # Feature modules
├── lib/                   # Utilities
│   └── supabase/         # Supabase clients
├── scripts/              # Utility scripts
└── rebuild/              # Database setup scripts
```

## 🔐 Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
vercel
```

Add environment variables in Vercel dashboard.

## 📖 Additional Documentation

- **[Complete Setup Guide](./COMPLETE-SETUP-GUIDE.md)** - Full setup and troubleshooting
- **[Rebuild Scripts](./rebuild/README.md)** - Database setup scripts
- **[Supabase Setup](./docs/SUPABASE-SETUP.mdx)** - Supabase configuration

## 🐛 Troubleshooting

For common issues and solutions, see the [Troubleshooting section](./COMPLETE-SETUP-GUIDE.md#troubleshooting) in the Complete Setup Guide.

## 📞 Support

For issues or questions:
1. Check [COMPLETE-SETUP-GUIDE.md](./COMPLETE-SETUP-GUIDE.md)
2. Review Supabase Auth Logs
3. Check browser console for errors

## ✅ System Status

🟢 **FULLY OPERATIONAL**

- ✅ All 7 user roles working
- ✅ Authentication system functional
- ✅ Database schema complete
- ✅ Ready for production

---

**Developed for Shifa Hospital** | Built with Next.js & Supabase
