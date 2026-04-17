"use client";

import { usePathname } from "next/navigation";
import ComingSoon from "@/components/ui/ComingSoon";

export default function CatchAllPage() {
  const pathname = usePathname();

  return <ComingSoon title={pathname.split("/").pop() || "Page"} />;
}
