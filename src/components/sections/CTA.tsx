export default function CTA() {
  return (
    <section className="bg-[#F5F3FF] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl px-6 py-12 text-center shadow-xl sm:px-12 sm:py-16">
          {/* Premium Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#5B5FEF] via-[#7C6CF6] to-[#A78BFA]" />

          {/* Radial Glow Effects */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
          </div>

          {/* Soft Overlay for Depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />

          {/* Content */}
          <div className="relative z-10">
            {/* Heading */}
            <h2 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Ready to start your climb?
            </h2>

            {/* Description */}
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/90 sm:text-lg">
              Join over 100,000+ students already learning on Draftien. Your
              seat at the top is waiting.
            </p>

            {/* Input & Button */}
            <div className="mx-auto mt-8 flex max-w-xl flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <input
                type="tel"
                placeholder="Enter your mobile number"
                className="w-full rounded-full border border-white/30 bg-white/15 px-6 py-3 text-white placeholder-white/70 backdrop-blur-md outline-none focus:ring-2 focus:ring-white"
              />

              <button
                type="button"
                className="w-full shrink-0 whitespace-nowrap rounded-full bg-white px-6 py-3 font-semibold text-indigo-600 shadow-md transition hover:bg-gray-100 sm:w-auto"
              >
                Get Started
              </button>
            </div>

            {/* Disclaimer */}
            <p className="mt-4 text-sm text-white/80">
              No credit card required. Free counseling sessions available.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
