# JXTENTO — Solana Trade Intelligence

JXTENTO maps every wallet, funding trail, and bundle on Solana in realtime. This repository contains the Next.js web application for the JXTENTO platform.

## Architecture & Tech Stack

This project is built using modern frontend best practices:
- **Framework**: [Next.js (App Router)](https://nextjs.org) for SSR, SEO, and optimal routing.
- **Library**: [React 19](https://react.dev)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) for pixel-perfect, utility-first styling.
- **Language**: [TypeScript](https://www.typescriptlang.org/) for strict type safety.
- **Fonts**: `next/font/google` (DM Serif Display, IBM Plex Mono, Instrument Sans).

## Features

- **Component-Driven UI**: Modular components separated by concern (e.g., `Hero`, `MapCanvas`, `Features`, `Navbar`, `Footer`).
- **Data-Driven Architecture**: All static content is defined in `src/constants/index.ts` and strongly typed in `src/types/index.ts`, allowing for easy maintainability without touching UI code.
- **Interactive Visualizations**: Custom Canvas-based force-directed node graph wrapped in a React Client Component (`MapCanvas.tsx`), optimized for performance with cleanup hooks to prevent memory leaks.
- **Responsive Design**: Fully responsive layout tailored for mobile, tablet, and desktop environments.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running.

## Project Structure

```
├── app/                  # Next.js App Router (pages, layouts, globals.css)
├── components/           # Reusable UI components
│   ├── layout/           # Navbar, Footer
│   ├── sections/         # Feature blocks, Hero, MapCanvas
│   └── ui/               # Granular reusable elements (Button, Ticker)
├── constants/            # Static data structures for mapping in components
└── types/                # TypeScript interfaces and models
```

## Agent Guidelines

When modifying this repository with an AI agent, please refer to `AGENTS.md` for our strict clean code and best practice guidelines to ensure code quality is preserved.
