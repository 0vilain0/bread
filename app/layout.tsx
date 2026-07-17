import type { Metadata } from "next";
import { ToastProvider } from "@/context/ToastContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "BREAD - AI Career Pivot Platform",
  description: "Bake your career transition — AI-powered roadmap, interactive quizzes, and curated resources.",
  keywords: ["career change", "AI roadmap", "skills assessment", "career pivot"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="stage-safe">
      <body className="bg-bread-cream text-bread-charcoal stage-safe min-h-screen antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
