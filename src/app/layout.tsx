import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simple To-Do List",
  description: "A simple to-do list application with authentication and local storage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-white text-black antialiased font-sans">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
