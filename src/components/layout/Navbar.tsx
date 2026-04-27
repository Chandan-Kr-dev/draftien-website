"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { navLinks } from "@/data/home";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const dashboardHref =
    user?.role === "teacher"
      ? "/teacher"
      : user?.role === "student"
        ? "/student"
        : "/select-role";

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="inline-flex items-center"
            aria-label="Draftien home"
          >
            <Image
              src="/images/logo.png"
              alt="Draftien"
              width={140}
              height={40}
              priority
              className="h-8 w-auto max-w-[150px] object-contain md:h-9 md:max-w-[170px]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-700 transition hover:text-indigo-600"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden items-center gap-4 md:flex">
            {isAuthenticated ? (
              <Link
                href={dashboardHref}
                className="rounded-full bg-indigo-50 px-5 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
              >
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  Join for Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden"
            onClick={openMenu}
            aria-label="Open Menu"
            aria-expanded={isOpen}
            aria-controls="mobile-drawer"
          >
            <Menu className="h-6 w-6 text-gray-800" />
          </button>
        </div>
      </header>

      {/* Overlay */}
      <button
        type="button"
        aria-label="Close Menu Overlay"
        className={`fixed inset-0 z-55 bg-black/30 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={closeMenu}
      />

      {/* Sliding Drawer */}
      <aside
        id="mobile-drawer"
        className={`fixed top-0 right-0 z-60 h-full w-full max-w-72 bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-indigo-100 px-4 py-4">
          <Image
            src="/images/logo.png"
            alt="Draftien"
            width={120}
            height={34}
            className="h-7 w-auto object-contain"
          />
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close Menu"
            className="rounded-md p-1 hover:bg-gray-100"
          >
            <X className="h-6 w-6 text-gray-800" />
          </button>
        </div>

        {/* Drawer Navigation */}
        <nav className="flex flex-col gap-4 px-6 py-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-base font-medium text-gray-700 transition hover:text-indigo-600"
              onClick={closeMenu}
            >
              {link.name}
            </Link>
          ))}

          <hr className="my-2 border-indigo-100" />

          {isAuthenticated ? (
            <Link
              href={dashboardHref}
              className="mt-2 rounded-full bg-indigo-50 px-4 py-2 text-center font-semibold text-indigo-700 transition hover:bg-indigo-100"
              onClick={closeMenu}
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-base font-medium text-gray-700 hover:text-indigo-600"
                onClick={closeMenu}
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className="mt-2 rounded-full bg-indigo-600 px-4 py-2 text-center font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                onClick={closeMenu}
              >
                Join for Free
              </Link>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
