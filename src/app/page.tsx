import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const instant = false;

export default async function HomePage() {
  let userId: string | null = null;
  try {
    const authState = await auth();
    userId = authState.userId;
  } catch {
    userId = null;
  }

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      {/* Simple Header */}
      <header className="border-b border-gray-200">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-bold text-black">
            TaskFlow
          </Link>

          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/sign-in"
              className="text-gray-700 hover:text-black"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="rounded bg-blue-600 px-3 py-1.5 font-medium text-white hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Simple Hero */}
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-black sm:text-4xl">
            Simple To-Do List App
          </h1>

          <p className="mt-3 text-base text-gray-600">
            A plain and simple task manager. Your tasks are saved directly in
            your browser and linked to your personal login.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="rounded bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
            >
              Get Started
            </Link>
            <Link
              href="/sign-in"
              className="rounded border border-gray-300 px-5 py-2 font-medium text-gray-700 hover:bg-gray-50"
            >
              Sign In
            </Link>
          </div>

          {/* Simple Features */}
          <div className="mt-12 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
            <div className="rounded border border-gray-200 p-4">
              <h2 className="font-semibold text-black">Clerk Login</h2>
              <p className="mt-1 text-sm text-gray-600">
                Sign up and sign in using secure Clerk authentication.
              </p>
            </div>

            <div className="rounded border border-gray-200 p-4">
              <h2 className="font-semibold text-black">Local Storage</h2>
              <p className="mt-1 text-sm text-gray-600">
                Tasks are stored in your browser under your unique user ID.
              </p>
            </div>

            <div className="rounded border border-gray-200 p-4">
              <h2 className="font-semibold text-black">Easy Management</h2>
              <p className="mt-1 text-sm text-gray-600">
                Add, edit, filter, and mark tasks as done anytime.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        <p>Simple To-Do App with Next.js, Clerk, and Tailwind CSS.</p>
      </footer>
    </div>
  );
}
