"use client";

import { LogOut, type LucideIcon, Menu, Moon, Search, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

type SidebarLink = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export default function DashboardShell({
  children,
  links,
  panel,
}: {
  children: React.ReactNode;
  links: SidebarLink[];
  panel: "student" | "teacher";
}) {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // drawer

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const shouldUseDark = stored ? stored === "dark" : prefersDark;

    document.documentElement.classList.toggle("dark", shouldUseDark);
    setIsDarkMode(shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const next = !isDarkMode;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDarkMode(next);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0B0F19]">
      {/* Overlay (mobile) */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 z-50 h-screen w-64 flex flex-col",
          "bg-white/80 dark:bg-white/5 backdrop-blur-xl border-r border-gray-200 dark:border-white/10",
          "transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Top */}
        <div className="flex-1">
          {/* Logo + Close */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="logo" width={32} height={32} />
              <span className="font-semibold text-lg text-gray-900 dark:text-white">
                Draftien
              </span>
            </div>

            {/* Close btn mobile */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="lg:hidden"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Links */}
          <nav className="p-3 space-y-1">
            {links.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);

              const Icon = link.icon;

              return (
                <button
                  type="button"
                  key={link.href}
                  onClick={() => {
                    router.push(link.href);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition",
                    isActive
                      ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10",
                  )}
                >
                  <Icon size={18} />
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom */}
        <div className="p-3 border-t border-gray-200 dark:border-white/10 space-y-1">
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <Moon size={18} />
            {isDarkMode ? "Light mode" : "Dark mode"}
          </button>

          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader panel={panel} onMenuClick={() => setIsOpen(true)} />

        <main className="p-4 sm:p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}

/* ================= HEADER ================= */

function DashboardHeader({
  panel,
  onMenuClick,
}: {
  panel: "student" | "teacher";
  onMenuClick: () => void;
}) {
  const pathname = usePathname();

  const getTitle = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 1) return "Dashboard";
    return formatTitle(segments[segments.length - 1]);
  };

  return (
    <header className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Hamburger */}
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden rounded-md p-1 text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            {getTitle()}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
            {panel === "student" ? "Student Panel" : "Teacher Panel"}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-white/10 px-3 py-2 rounded-lg">
          <Search size={16} className="text-gray-400" />
          <input
            aria-label="Search dashboard"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-48 sm:w-72 text-gray-700 dark:text-gray-200"
          />
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-medium">
          U
        </div>
      </div>
    </header>
  );
}

function formatTitle(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
