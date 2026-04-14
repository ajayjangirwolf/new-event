# Evently - Event Management & Ticketing

Production-ready event ticketing app built with Next.js App Router.

## Stack

- Next.js (App Router)
- Tailwind CSS
- shadcn-style UI components
- Zustand
- React Hook Form + Zod
- MongoDB + Mongoose
- JWT auth
- QR generation (`qrcode`)
- QR scanner (`html5-qrcode`)
- Email (`nodemailer`)

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env.local
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Core structure

- `/app` - Pages and API route handlers
- `/components` - Reusable UI and feature components
- `/lib` - Shared utilities and services
- `/models` - Mongoose schemas
- `/api` - Client API helper layer

## Features

- Signup/login with JWT and role-based access (`user`, `organizer`)
- Organizer event CRUD and analytics dashboard
- Event discovery and event detail pages
- Ticket purchase flow with simulated payment success
- Unique QR ticket generation and storage
- Ticket confirmation email with QR image
- Organizer scanner page with QR validation and one-time usage marking
