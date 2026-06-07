import type { Metadata } from "next";
import { Noto_Serif } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

// Noto Serif with Greek subset renders polytonic marks, breathing marks,
// accents, and iota subscript correctly on mobile and desktop.
const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin", "greek"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Biblical Greek",
  description: "Learn Biblical Greek from your course materials",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el" className={`${notoSerif.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900 antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
