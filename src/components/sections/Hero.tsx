import { Search, TrendingUp } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-[#F5F3FF] pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <span className="inline-block rounded-full bg-indigo-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Master JEE & NEET 2025
            </span>

            {/* Heading */}
            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Your Future{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
                Perfectly
              </span>{" "}
              Drafted.
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-lg text-gray-600">
              Experience India's most curated learning environment. Elite
              faculty, AI-driven doubt solving, and a community of
              high-achievers.
            </p>

            {/* Search Bar */}
            <div className="mt-6 flex items-center rounded-full border border-gray-200 bg-white shadow-sm">
              <Search className="ml-4 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for 'Organic Chemistry'..."
                className="w-full rounded-full bg-transparent px-3 py-3 text-sm text-gray-700 outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700"
              >
                <TrendingUp size={18} />
                Compete Now
              </button>

              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-sm transition hover:bg-indigo-50"
              >
                Ask a Doubt
              </button>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            {/* Background Glow */}
            {/* <div className="absolute -inset-4 rotate-6 rounded-[2rem] bg-gradient-to-tr from-indigo-200 via-purple-200 to-fuchsia-200 opacity-60 blur-2xl"></div> */}

            {/* Glass Layer */}
            <div className="absolute -inset-3 rotate-2 rounded-[2.4rem] border border-white/60 bg-[#E9DFFF]/95 shadow-lg backdrop-blur-xl"></div>

            {/* Image Card */}
            <Image
              src="/images/hero-student.jpg"
              alt="Student studying"
              width={600}
              height={500}
              className="relative z-10 h-full w-full rounded-[2rem] object-cover shadow-xl"
              priority
            />

            {/* Floating Stats Card */}
            <div className="absolute -bottom-6 left-6 z-20 flex items-center gap-4 rounded-xl bg-white p-4 shadow-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                <TrendingUp className="h-5 w-5 text-pink-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">
                  ACTIVE STUDENTS
                </p>
                <p className="text-lg font-bold text-gray-900">45.8k+</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
