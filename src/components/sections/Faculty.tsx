import Image from "next/image";
import { facultyMembers } from "@/data/home";

export default function Faculty() {
  // Duplicate data for seamless infinite scrolling
  const duplicatedFaculty = [...facultyMembers, ...facultyMembers];

  return (
    <section className="bg-[#F5F3FF] py-16 sm:py-20">
      {/* Apply overflow-hidden here */}
      <div className="mx-auto max-w-7xl overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            The Faces Behind Your Rank
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Learn from educators who have mentored thousands of AIR holders.
          </p>
        </div>

        {/* Scrolling Faculty Cards */}
        <div className="relative mt-12 overflow-hidden">
          <div className="faculty-scroll flex w-max gap-6">
            {duplicatedFaculty.map((member, index) => (
              <div
                key={index}
                className="group w-[260px] flex-shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                {/* Image */}
                <div className="relative h-72 w-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover grayscale transition duration-300 group-hover:grayscale-0"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Name & Title */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-sm opacity-90">{member.title}</p>
                  </div>
                </div>

                {/* Achievement */}
                <div className="bg-gray-50 px-4 py-3 text-center">
                  <p className="text-sm font-medium text-indigo-600">
                    {member.achievement}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
