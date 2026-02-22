# 🎵 Profynus Music

<div align="center">

**A Social Music Platform for Creators and Listeners**

Profynus Music is a modern music sharing platform where artists can upload their music, engage with a community, and compete for weekly recognition. Listeners can stream, download, and discover new music from talented creators worldwide.

[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Project Structure](#-project-structure)
- [Core Features](#-core-features)
- [Development](#-development)
- [Building for Production](#-building-for-production)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎤 For Artists
- **Upload Music**: Share your original tracks with the community
- **Public Feed**: Showcase your music in a dynamic social feed
- **Weekly Competitions**: Compete for the most reactions each week
- **Winner Playlist**: Top songs are featured in the prestigious weekly winner playlist

### 🎧 For Listeners
- **Stream Music**: Listen to tracks directly in your browser
- **Download Tracks**: Save your favorite songs from public repositories
- **Discover New Artists**: Explore trending and featured music
- **React & Engage**: Show support for your favorite tracks

### 🌟 Platform Features
- **Responsive Design**: Beautiful UI that works on all devices
- **Smooth Animations**: Enhanced UX with Framer Motion
- **Authentication System**: Secure user registration and login
- **Internationalization**: Multi-language support (i18n)
- **SEO Optimized**: Better discoverability for artists and tracks

---

## 🛠 Tech Stack

### Frontend
- **[React 19.2](https://reactjs.org/)** - UI library with latest features
- **[Vite 7.3](https://vitejs.dev/)** - Lightning-fast build tool and dev server
- **[TailwindCSS 4.1](https://tailwindcss.com/)** - Utility-first CSS framework
- **[React Router 7.13](https://reactrouter.com/)** - Client-side routing
- **[Framer Motion 12.33](https://www.framer.com/motion/)** - Animation library
- **[Zustand 5.0](https://zustand-demo.pmnd.rs/)** - Lightweight state management

### Libraries & Tools
- **[Axios 1.13](https://axios-http.com/)** - HTTP client for API requests
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[ESLint](https://eslint.org/)** - Code linting and quality
- **pnpm** - Fast, disk space efficient package manager

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher)

```bash
# Install pnpm globally if you haven't already
npm install -g pnpm
```

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/profynus.git
cd profynus
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=your_api_url_here
VITE_APP_NAME=Profynus Music
```

### Running the App

**Development mode** (with hot reload):

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

**Preview production build**:

```bash
pnpm build
pnpm preview
```

---

## 📁 Project Structure

```
profynus/
├── public/                 # Static assets
├── src/
│   ├── api/               # API configuration
│   │   ├── axiosInstance.js
│   │   ├── endpoints.js
│   │   └── services/      # API service modules
│   │       ├── authService.js
│   │       └── userService.js
│   ├── assets/            # Images, icons, and media
│   │   ├── icons/
│   │   └── images/
│   ├── components/        # Reusable UI components
│   │   └── landing/       # Landing page components
│   ├── features/          # Feature-specific modules
│   ├── fonts/             # Custom fonts
│   ├── hooks/             # Custom React hooks
│   ├── i18n/              # Internationalization config
│   ├── pages/             # Page components
│   │   ├── landing/
│   │   └── login/
│   ├── routes/            # Route definitions
│   ├── services/          # Utility services
│   │   └── SEO.jsx
│   ├── store/             # Zustand state management
│   │   ├── auth/          # Authentication state
│   │   ├── ui/            # UI state
│   │   └── user/          # User state
│   ├── utils/             # Helper functions
│   ├── index.css          # Global styles
│   └── main.jsx           # Application entry point
├── .gitignore
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML template
├── jsconfig.json          # JavaScript configuration
├── package.json           # Dependencies and scripts
├── pnpm-lock.yaml         # Lock file for pnpm
├── vite.config.js         # Vite configuration
└── README.md              # This file
```

---

## 🎯 Core Features

### 1. Music Upload & Sharing
Artists can upload their music tracks, add metadata (title, description, genre), and share them instantly on the public feed.

### 2. Social Feed
A dynamic feed displays newly uploaded tracks, allowing users to:
- Stream tracks directly
- React and engage with content
- Follow their favorite artists
- Share tracks across social platforms

### 3. Weekly Competition System
Every week, tracks compete for community engagement:
- Songs accumulate reactions (likes, favorites, shares)
- Top-performing tracks are automatically selected
- Winners are featured in a special **Winner Playlist**
- Competition resets every Monday

### 4. Music Streaming & Downloads
The platform offers flexible listening options:
- **In-Browser Streaming**: Play music directly on the website
- **Download**: Save tracks from public repositories for offline listening
- **Playlist Management**: Create and organize personal playlists

### 5. User Authentication
Secure authentication system with:
- User registration and login
- Profile management
- Session persistence
- Protected routes for authenticated users

---

## 💻 Development

### Code Quality

**Run linter**:
```bash
pnpm lint
```

**Auto-fix linting issues**:
```bash
pnpm lint --fix
```

### State Management

This project uses **Zustand** for state management. Store modules are organized by domain:

- `store/auth/` - Authentication state
- `store/user/` - User profile and preferences
- `store/ui/` - UI state (modals, notifications, etc.)

### API Integration

API services are centralized in `src/api/services/`:

```javascript
// Example: Using the auth service
import { authService } from '@/api/services/authService';

const handleLogin = async (credentials) => {
  const response = await authService.login(credentials);
  // Handle response
};
```

### Styling

The project uses **TailwindCSS** for styling. Global styles are in `src/index.css`.

Custom animations are powered by **Framer Motion**:

```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

---

## 🏗 Building for Production

### Create production build:

```bash
pnpm build
```

The optimized build will be in the `dist/` directory.

### Build output includes:
- Minified JavaScript bundles
- Optimized CSS
- Compressed assets
- Source maps (optional)

### Deployment

The build can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop `dist/` folder
- **GitHub Pages**: Use `gh-pages` package
- **AWS S3**: Upload `dist/` contents

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎶 About Profynus Music

Profynus Music aims to democratize music discovery and give independent artists a platform to shine. Every week, talented musicians compete for recognition, and listeners discover their next favorite song.

**Join us in building the future of music sharing!**

---

<div align="center">

Made with ❤️ by the Profynus Team

[Website](https://profynus.com) • [Twitter](https://twitter.com/profynus) • [Discord](https://discord.gg/profynus)

</div>
