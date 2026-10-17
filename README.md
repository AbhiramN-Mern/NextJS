# TaskFlow: Minimal To-Do List App with Next.js & Clerk

A clean, responsive, and modern To-Do List application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Clerk** authentication. 

Tasks are persisted directly in the browser's `localStorage` scoped to each authenticated user's unique Clerk ID (`todo-tasks-${userId}`). No external database or backend API is required.

---

## 1. Prerequisites

Before running this project, ensure you have the following installed on your machine:
- **Node.js**: v18.18.0 or newer (v20+ or v24+ recommended)
- **npm** (comes with Node.js) or any preferred package manager (pnpm, yarn)
- A free **[Clerk](https://clerk.com)** account for user authentication

---

## 2. Dependencies Installation

To install all required packages:

```bash
npm install
```

Core dependencies installed:
- `next`: Latest stable Next.js with App Router
- `react` & `react-dom`: React 19
- `@clerk/nextjs`: Official Clerk SDK for Next.js
- `tailwindcss`: Styling and modern design tokens
- `lucide-react`: Clean, accessible icons

---

## 3. Creating & Configuring a Clerk Application

1. Navigate to the **[Clerk Dashboard](https://dashboard.clerk.com)** and sign in.
2. Click **"Add application"**.
3. Choose an application name (e.g., `TaskFlow To-Do`).
4. Select the authentication methods you wish to support (e.g., Email, Google, GitHub).
5. Click **"Create application"**.
6. In the left navigation, go to **API Keys** and locate:
   - **Publishable Key** (starts with `pk_test_...`)
   - **Secret Key** (starts with `sk_test_...`)

---

## 4. Setting Up `.env.local`

1. In the root directory of the project, create a `.env.local` file (you can copy `.env.example`):

```bash
cp .env.example .env.local
```

2. Add your Clerk API keys and configure redirect routes in `.env.local`:

```env
# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Clerk Redirection URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
```

> **Security Note:** `.env.local` is listed in `.gitignore` and is never committed to source control. Never commit or expose your `CLERK_SECRET_KEY`.

---

## 5. Running the Application

### Development Mode

Run the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- Visiting `/` when logged out shows the landing page.
- Visiting `/` when logged in automatically redirects to `/dashboard`.
- Visiting `/dashboard` when logged out automatically redirects to `/sign-in`.

### Linting and Production Build

To run the ESLint verification:
```bash
npm run lint
```

To test the production build:
```bash
npm run build
```

To start the production server:
```bash
npm run start
```

---

## 6. How `localStorage` Persistence Works

1. **User-Scoped Isolation**:
   - Each authenticated Clerk user possesses a unique `userId` (e.g., `user_2t...`).
   - Tasks are stored under the dynamic key `todo-tasks-${userId}` in `window.localStorage`.
   - When a user logs in, the app queries only their corresponding storage key.
   - When switching accounts, the previous state is unmounted and the new user's tasks are safely loaded.

2. **Hydration Protection & Safe Writes**:
   - Browser storage is strictly client-side. The app prevents Next.js hydration mismatches by tracking an `isLoaded` flag.
   - A skeleton placeholder is shown until client-side loading finishes.
   - Crucially, the app **never overwrites** existing saved tasks with an initial empty array during initial render or before data has loaded from `localStorage`.

3. **Data Integrity**:
   - Task records parse and serialize via JSON with defensive schema verification.
   - If invalid JSON is encountered, it is handled gracefully without crashing the app.

---

## 7. Current Architecture & Storage Limitations

Because this application intentionally uses **browser `localStorage`** instead of an external database:
- **Browser-Specific**: Tasks exist exclusively inside the specific web browser and profile where they were created.
- **No Cross-Device Sync**: Creating tasks on your phone or laptop will not sync to other devices.
- **Cache Clearing**: Clearing browser cache or site data will delete saved tasks.
- **Client-Side Data Boundary**: `localStorage` is accessible to client scripts in that browser profile. It does not provide server-side encryption or server-enforced access controls.

---

## 8. Project Structure

```
├── .env.example                # Template for environment variables
├── package.json                # Project dependencies and scripts
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with ClerkProvider
│   │   ├── page.tsx            # Landing page with auth redirect
│   │   ├── globals.css         # Tailwind CSS imports and base styles
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Protected dashboard with UserButton
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]]/
│   │   │       └── page.tsx    # Clerk Sign In prebuilt page
│   │   └── sign-up/
│   │       └── [[...sign-up]]/
│   │           └── page.tsx    # Clerk Sign Up prebuilt page
│   ├── components/
│   │   ├── TodoList.tsx        # State management, metrics, and persistence
│   │   ├── TodoItem.tsx        # Task item with inline edit and delete confirm
│   │   └── TaskFilters.tsx     # Filter pills (All, Active, Completed) + counters
│   ├── types/
│   │   └── todo.ts             # Task and filter TypeScript interfaces
│   └── proxy.ts                # Next.js 16 Clerk route protection proxy
```
