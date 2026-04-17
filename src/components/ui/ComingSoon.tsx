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
    <div className="flex flex-col items-center justify-center h-full text-center py-20">
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-4">
        <Rocket size={28} />
      </div>

      <h1 className="text-2xl font-semibold mb-2">{title}</h1>

      <p className="text-gray-500 max-w-md">{description}</p>
    </div>
  );
}