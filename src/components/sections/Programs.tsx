import { ArrowRight, Calendar, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { programs } from "@/data/home";

export default function Programs() {
  return (
    <section className="bg-[#F5F3FF] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Our Flagship Programs
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Curated batches tailored for different stages of prep.
            </p>
          </div>

          <Link
            href="#"
            className="inline-flex items-center gap-2 font-medium text-indigo-600 hover:text-indigo-700"
          >
            View all batches
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Program Cards */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <div
              key={program.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg"
            >
              {/* Image Section */}
              <div className="relative h-52 w-full">
                <Image
                  src={program.image}
                  alt={program.title}
                  fill
                  className="object-cover"
                />

                {/* Tag */}
                <span
                  className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white ${program.tagColor}`}
                >
                  {program.tag}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {program.title}
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  {program.description}
                </p>

                {/* Stats */}
                <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    {program.duration}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    {program.students}
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 line-through">
                      {program.originalPrice}
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {program.price}
                    </p>
                  </div>

                  <button className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700">
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
