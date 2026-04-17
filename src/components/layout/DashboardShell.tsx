"use client";

import { LogOut, Moon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

type SidebarLink = {
  label: string;
  href: string;
  icon: any;
};

export default function DashboardShell({
  children,
  links,
  role,
}: {
  children: React.ReactNode;
  links: SidebarLink[];
  role: "student" | "teacher";
}) {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col justify-between">
        {/* Top */}
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center gap-2 px-6 border-b">
            <Image
              src="/images/logo.png"
              alt="Draftien"
              width={32}
              height={32}
            />
            <span className="font-semibold text-lg">Draftien</span>
          </div>

          {/* Links */}
          <nav className="p-4 space-y-1">
            {links.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/");

              const Icon = link.icon;

              return (
                <button
                  type="button"
                  key={link.href}
                  onClick={() => router.push(link.href)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition",
                    isActive
                      ? "bg-indigo-50 text-indigo-600 font-medium"
                      : "text-gray-600 hover:bg-gray-100",
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
        <div className="p-4 border-t space-y-2">
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
          >
            <Moon size={18} />
            Appearance
          </button>

          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <DashboardHeader role={role} />

        {/* Content */}
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}

function DashboardHeader({ role }: { role: "student" | "teacher" }) {
  const pathname = usePathname();

  const getTitle = () => {
    const segments = pathname.split("/").filter(Boolean);

    // Example:
    // /student/courses → ["student", "courses"]
    // /teacher/analytics → ["teacher", "analytics"]

    if (segments.length === 1) {
      return "Dashboard";
    }

    const lastSegment = segments[segments.length - 1];

    return formatTitle(lastSegment);
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">{getTitle()}</h1>

      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">Welcome back 👋</div>

        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
          U
        </div>
      </div>
    </header>
  );
}

function formatTitle(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
