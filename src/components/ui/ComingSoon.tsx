"use client";

import { Rocket } from "lucide-react";

export default function ComingSoon({
  title = "Coming Soon",
  description = "We're working hard to bring this feature to you.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
        <Rocket size={28} />
      </div>

      <h1 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h1>

      <p className="max-w-md text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
}
