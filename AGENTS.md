<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Clean Code & Best Practices (JXTENTO)

When making modifications or adding new features to this codebase, you MUST adhere to the following clean code guidelines to prevent code smells and maintain high code quality:

## 1. Type Safety (Strict TypeScript)
- **Never use `any`**. All props, state, and data structures must have explicitly defined TypeScript interfaces or types.
- Place shared types in `src/types/index.ts` or a relevant domain-specific file inside `src/types/`.
- Rely on TypeScript for inference where obvious, but always type component props.

## 2. Component Architecture & SRP (Single Responsibility)
- Keep components small and focused on a single responsibility.
- If a component exceeds ~150 lines or manages multiple complex pieces of logic, refactor it into smaller sub-components.
- **Isolate Client State**: Default to Server Components (`React Server Components`). Only use `"use client"` directive on the smallest possible leaf component that actually requires interactivity (e.g., hooks, event listeners).

## 3. Separation of Concerns (Data & Logic)
- **Do not hardcode static arrays or long text directly in UI components**. Move configuration, navigation links, and static content data into `src/constants/index.ts` and render them using `.map()`.
- Extract complex business logic or repetitive API calls into custom hooks (`src/hooks/`) or utility functions (`src/utils/`).

## 4. Don't Repeat Yourself (DRY)
- If you find yourself writing the same Tailwind class strings or HTML structures more than twice, extract them into a reusable component (e.g., inside `src/components/ui/`).
- Use `clsx` or `tailwind-merge` if dynamic class composition is required in reusable components.

## 5. Styling & Tailwind CSS
- Use Tailwind CSS utility classes. Avoid creating custom CSS in `globals.css` unless necessary for complex animations, highly specific gradients, or global theme variable declarations (`@theme inline`).
- Maintain pixel-perfect fidelity. Use responsive prefixes (`md:`, `lg:`, `max-md:`) effectively instead of writing duplicate HTML for different viewports.

## 6. Performance & Accessibility
- Use `next/image` for images and `next/link` for internal navigation.
- Ensure all interactive elements have appropriate accessible attributes (aria-labels, roles) and semantic HTML tags (e.g., `<nav>`, `<header>`, `<main>`, `<section>`, `<footer>`).
