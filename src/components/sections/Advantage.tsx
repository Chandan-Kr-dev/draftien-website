import { features } from "@/data/home";

export default function Advantage() {
  return (
    <section className="bg-[#F3ECFA] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            The <span className="text-indigo-600">Draftien</span> Advantage
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Designed for depth, not just data. Study smarter, not longer.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="flex h-full flex-col rounded-3xl bg-white p-8 shadow-sm transition duration-300 hover:shadow-md"
              >
                {/* Icon */}
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bgColor}`}
                >
                  <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>

                {/* Title */}
                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
