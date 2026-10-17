import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import TodoList from "@/components/TodoList";

export const instant = false;

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const displayName =
    user?.firstName ||
    user?.username ||
    user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
    "there";

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      {/* Simple Header */}
      <header className="border-b border-gray-200">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="text-lg font-bold text-black">
            TaskFlow
          </Link>

          <div className="flex items-center gap-2">
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-6">
        <div className="mx-auto max-w-2xl px-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-black">
              Hello, {displayName}!
            </h1>
            <p className="text-sm text-gray-600">
              Here is your to-do list.
            </p>
          </div>

          {/* Todo List Client Component */}
          <TodoList userId={userId} />
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        <p>Tasks are saved in your browser&apos;s localStorage.</p>
      </footer>
    </div>
  );
}
