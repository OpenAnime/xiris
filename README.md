
# Xiris ⚡️

[![License](https://img.shields.io/github/license/OpenAnime/xiris)](LICENSE)
[![Stars](https://img.shields.io/github/stars/OpenAnime/xiris?style=social)](https://github.com/OpenAnime/xiris)

> A modern update server for Electron apps

**Xiris** is a sleek and flexible Electron update server inspired by [Vercel's Hazel](https://github.com/vercel/hazel), reimagined with modern web technologies.

Built with: \
![SvelteKit](https://img.shields.io/badge/SvelteKit-%23ff3e00?style=for-the-badge&logo=svelte&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-%23646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-%2306B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![ParaglideJS](https://img.shields.io/badge/ParaglideJS-%23327EFF?style=for-the-badge&logo=translate&logoColor=white)


## 🚀 Features

- 🌐 Internationalization support via **ParaglideJS**
- 🎨 Rapid styling with **Tailwind CSS**
- 💾 Smart caching using **SQLite** (can be swapped with in-memory for serverless environments)
- 🔐 **Private repo** support via GitHub tokens
- 🧪 Support for **pre-releases** and **pre-update channels**


## 🛠 Configuration

Set up your environment using a `.env` file at the root of the project:

```env
APP_URL=https://your-xiris-server.com        # Required: Used in RELEASES file
PORT=3000                                    # Optional: Defaults to 3000
GITHUB_REPO=your-org/your-repo               # Required: Target GitHub repo
GITHUB_TOKEN=ghp_your_token_here             # Optional: For private repositories
GITHUB_PRE_RELEASES=true                     # Optional: Allow downloading pre-releases
GITHUB_PRE_UPDATE=true                       # Optional: Allow pre-releases in update channel
REFRESH_INTERVAL=15m                         # Optional: Default is 15 minutes
````


## 📦 Getting Started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Run the dev server**

   ```bash
   pnpm dev
   ```

3. **Build for production**

   ```bash
   pnpm build
   ```

4. **Preview production build**

   ```bash
   pnpm preview
   ```

## 🌍 Localization

Xiris uses [ParaglideJS](https://paraglidejs.org) for type-safe i18n across all routes. Language switching is seamless and supports SSR.

## 📤 Deployment

Xiris works well on any Node-compatible hosting provider. For serverless use cases, switch the cache backend to an in-memory adapter.

We recommend [Vercel](https://vercel.com) for zero-config deployment.

## 🙌 Credits

Inspired by [Vercel Hazel](https://github.com/vercel/hazel), rebuilt with modern tools and open-source love.

## 📄 License

[GPL3](LICENSE) © \[OpenAnime]
