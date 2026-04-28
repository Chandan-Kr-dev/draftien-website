import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";
import { AuthGuard, AuthProvider } from "@/context/AuthContext";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Draftien",
  description: "Premium digital learning platform for JEE & NEET aspirants.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${workSans.variable} ${fraunces.variable}`}>
      <body className="bg-background font-sans text-foreground antialiased">
        <AuthProvider>
          <AuthGuard>
            <main>{children}</main>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
