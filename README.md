# 🌐 Portfolio 2025 — Modern Developer Portfolio

A **cutting-edge full-stack developer portfolio** built with **Next.js 14**, featuring a **blog**, **project showcase**, and an **admin dashboard** — designed for performance, scalability, and elegance.

![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## 🚀 Features

### ✨ Core Highlights

- **Modern UI Design** — Responsive, elegant layout with dark/light mode
- **Blazing Fast** — Built with Next.js 14 App Router for peak performance
- **Type-Safe Development** — 100% TypeScript-based
- **SEO Optimized** — Auto meta tags, structured data, and sitemap generation

---

## 🔐 Default Admin Credentials

For initial setup and testing, use these default admin credentials:

**Email:** `admin@portfolio.com`  
**Password:** `Admin@123!`

[🚀 Click here to access Admin Login](https://dev-rashedul.vercel.app/login?redirect=/dashboard)

---

### 🎯 Portfolio Essentials

- 🖼️ **Project Gallery** — Filterable portfolio with detailed project views
- ✍️ **Blog System** — Full-featured blogging with rich content editor
- 📬 **Contact Form** — Integrated with API for instant messaging
- 👨‍💻 **About Section** — Professionally presented skills & background

---

### 🧩 Admin Dashboard

- 📝 **Content Management** — Create, edit, and manage posts/projects
- 🧠 **Rich Text Editor** — Feature-rich editing experience
- 📁 **Media Upload** — Supports images & files
- 🔐 **Authentication** — Secure, session-based admin access

---

### ⚙️ Technical Features

- **RESTful API Routes** — Handles all CRUD operations
- **Database Integration** — Prisma ORM for efficient queries
- **Authentication** — Secure login/session handling
- **File Upload Support** — Cloud storage ready
- **Error Handling** — Detailed reporting and error tracking

---

## 📝 API Documentation

### 🔑 Authentication

| Method | Endpoint          | Description      |
| ------ | ----------------- | ---------------- |
| POST   | `/api/auth/login` | User login       |
| GET    | `/api/auth/me`    | Get current user |

### 📰 Blogs

| Method | Endpoint          | Description     |
| ------ | ----------------- | --------------- |
| GET    | `/api/blogs`      | List all blogs  |
| POST   | `/api/blogs`      | Create new blog |
| PUT    | `/api/blogs/[id]` | Update blog     |
| DELETE | `/api/blogs/[id]` | Delete blog     |

### 💼 Projects

| Method | Endpoint             | Description        |
| ------ | -------------------- | ------------------ |
| GET    | `/api/projects`      | List all projects  |
| POST   | `/api/projects`      | Create new project |
| PUT    | `/api/projects/[id]` | Update project     |
| DELETE | `/api/projects/[id]` | Delete project     |

---

## 🏗️ Project Structure

```
src/
├── app/                        # Next.js 14 App Router
│   ├── about/                  # About page components
│   ├── api/                    # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── blogs/              # Blog CRUD operations
│   │   ├── projects/           # Project management
│   │   ├── contact/            # Contact form handling
│   │   └── upload/             # File upload endpoints
│   ├── blogs/                  # Blog pages and components
│   ├── contact/                # Contact page
│   ├── dashboard/              # Admin dashboard
│   │   ├── blogs/              # Blog management
│   │   ├── projects/           # Project management
│   │   └── richTextEditor/     # Content editor
│   ├── login/                  # Authentication page
│   ├── projects/               # Project showcase
│   └── context/                # React context providers
├── components/                 # Reusable UI components
│   └── ui/                     # Shadcn/ui component library
├── lib/                        # Utility libraries
│   ├── auth.ts                 # Authentication helpers
│   ├── prisma.ts               # Prisma client setup
│   ├── utils.ts                # General utilities
│   └── hooks/                  # Custom React hooks
├── config/                     # Global app configuration
├── db/                         # Prisma schema files
├── hooks/                      # Reusable hooks
└── types/                      # TypeScript type definitions
```

---

## 🧠 Tech Stack

### 🖥️ Frontend

- **Next.js 14** — Modern React framework
- **TypeScript** — Strong typing for safety & reliability
- **Tailwind CSS** — Utility-first styling
- **Shadcn/ui** — Elegant, reusable UI components
- **Framer Motion** — Smooth animations

### ⚙️ Backend

- **Next.js API Routes** — Serverless functions for API
- **Prisma ORM** — Modern database management
- **NextAuth.js / Custom Auth** — Secure user authentication
- **Cloud Uploads** — Image & file handling

### 🧩 Development Tools

- **ESLint** — Linting & code quality
- **Prettier** — Code formatting
- **TypeScript** — Static type validation

---

## 📦 Installation

### 📋 Prerequisites

- Node.js **v18.17+**
- Package manager: `npm`, `yarn`, or `pnpm`
- Database: **PostgreSQL (recommended)**

---

### ⚡ Quick Start

**1️⃣ Clone the Repository**

```bash
git clone https://github.com/yourusername/portfolio2025.git
cd portfolio2025
```

**2️⃣ Install Dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

**3️⃣ Environment Setup**

```bash
cp .env.example .env.local
```

Then, update `.env.local` with your own values:

```env
DATABASE_URL="your_database_connection_string"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
UPLOAD_PATH="./public/uploads"
```

**4️⃣ Database Setup**

```bash
npx prisma generate
npx prisma db push
# For production:
npx prisma migrate deploy
```

**5️⃣ Run Development Server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Visit **http://localhost:3000** to explore your portfolio.

---

## 🚀 Deployment

### 🧭 Deploy on Vercel (Recommended)

1. Push your code to **GitHub**
2. Connect your repo to **Vercel**
3. Add environment variables in **Vercel Dashboard**
4. Deploy automatically 🎉

### 🧱 Other Platforms

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## ⚙️ Configuration

### 🧰 Customization

- **Site Config:** Update `src/config/site.ts`
- **Styling:** Modify Tailwind classes in components
- **Content:** Update portfolio & blog data
- **Colors:** Adjust CSS variables in `globals.css`

### 🔐 Environment Variables

Check `.env.example` for all required variables.

---

## ⚠️ Design Usage Notice

This project's **design, layout, and visual style** are proprietary and protected by the creator.  
While the **source code** is released under the **MIT License**, **you are not permitted to copy, reuse, or replicate the design** (UI/UX, visuals, structure) without explicit written consent.

---

### 📄 License

This project is licensed under the **MIT License**.  
See the `LICENSE` file for full details.

---

<div align="left">
Built with ❤️ using modern web technologies
</div>
