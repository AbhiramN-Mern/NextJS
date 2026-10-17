import { Suspense } from "react";
import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export const instant = false;

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-8 text-black">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="text-2xl font-bold text-black hover:text-blue-600"
          >
            TaskFlow
          </Link>
          <p className="mt-1 text-sm text-gray-600">
            Create a new account
          </p>
        </div>

        <div className="flex justify-center">
          <Suspense
            fallback={
              <div className="py-8 text-center text-sm text-gray-500">
                Loading sign up...
              </div>
            }
          >
            <SignUp />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
