# ⚡ Andri Creative | Portfolio & Admin Dashboard

Welcome to the official repository of **Andri Creative**, a premium and interactive Creative Developer Portfolio built with modern web technologies, smooth animations, and a powerful integrated Admin Dashboard.

---

## ✨ Features

- **🌐 Interactive Hero & Navigation**: Sleek entrance animations with a smart scroll lock/unlock mechanism, header navigations, and full responsiveness.
- **🎨 Glassmorphism & Modern UI**: Tailored color palettes, custom gradients, dynamic hover states, and smooth theme transitions.
- **💼 Projects & Experience Showcase**: Filterable portfolio list, detailed single project pages, and interactive career timeline.
- **📜 Certificates & Credentials**: Visual grid of achievements, complete with a lightbox preview (`react-photo-album` + `yet-another-react-lightbox`).
- **🛡️ Secure Admin Control Panel**: Integrated dashboard to update skills, experiences, bio, certificates, project files, and galleries.
- **✍️ Rich Text Editing**: Leverages TipTap for formatting content in the admin workspace.
- **📡 Real-time Updates & API**: Live synchronization using Pusher and server-side operations through Axios.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vite.dev/) (with Babel compiler optimized performance)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using `@tailwindcss/vite` plugin)
- **Routing**: [TanStack Router](https://tanstack.com/router) (file-based routing system)
- **State Management & Fetching**: [TanStack Query (React Query) v5](https://tanstack.com/query)
- **Animations**: [Motion](https://motion.dev/) (Framer Motion)
- **Real-time**: [Pusher JS](https://pusher.com/)
- **Icons**: [Iconify React](https://iconify.design/)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v18+ recommended) and **npm** installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/vite-bbckn.git
   cd vite-bbckn
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development Server

Start the local development server with:

```bash
npm run dev
```

This will run the project on `http://localhost:5173/` (or your configured port).

### Production Build

To compile and optimize the app for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 📁 Project Structure

```text
src/
├── assets/         # Static visual assets
├── components/     # Reusable UI parts (Hero, Projects, Skills, Certificates, Admin panels)
├── data/           # Mock data or constant values
├── hooks/          # Custom React hooks
├── layouts/        # Page shells (Navbar, Sidebars, MainLayout)
├── lib/            # Utility functions & configs
├── pages/          # Main page components & detail templates
├── routes/         # TanStack Router directory (File-based route structure)
├── services/       # API call handlers & client instances
└── main.tsx        # Application entrypoint
```

---

## 🎨 Design Systems & UI Details

- **Typography**: Custom-curated fonts integrated directly into CSS layers.
- **Themes**: System-wide dark/light mode toggle with smooth theme transition screens.
- **Interactions**: Subtle micro-animations, hover effects, and spring transitions.
