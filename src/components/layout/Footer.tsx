import { Globe, GraduationCap, Rocket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-600">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 text-center md:grid-cols-4 md:text-left">
          {/* Brand Section */}
          <div>
            <Link
              href="/"
              className="mx-auto inline-flex items-center md:mx-0"
              aria-label="Draftien home"
            >
              <Image
                src="/images/logo.png"
                alt="Draftien"
                width={180}
                height={52}
                className="h-10 w-auto max-w-[180px] object-contain md:h-12 md:max-w-[220px]"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed">
              Elevating educational standards through premium digital curation
              for competitive exams.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Company
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-indigo-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Support
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-indigo-600">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600">
                  Contact Faculty
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Follow Us
            </h4>
            <div className="mt-4 flex justify-center space-x-4 md:justify-start">
              <Globe className="h-5 w-5 cursor-pointer hover:text-indigo-600" />
              <GraduationCap className="h-5 w-5 cursor-pointer hover:text-indigo-600" />
              <Rocket className="h-5 w-5 cursor-pointer hover:text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 border-t border-gray-200 pt-6 text-center text-sm">
          <p>
            © {new Date().getFullYear()} Draftien. All rights reserved. Built
            for JEE & NEET excellence.
          </p>
        </div>
      </div>
    </footer>
  );
}
