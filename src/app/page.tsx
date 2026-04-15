import Advantage from "@/components/sections/Advantage";
import CTA from "@/components/sections/CTA";
import Faculty from "@/components/sections/Faculty";
import Hero from "@/components/sections/Hero";
import Programs from "@/components/sections/Programs";

export default function Home() {
  return (
    <main>
      <Hero />
      <Advantage />
      <Programs />
      <Faculty />
      <CTA />
    </main>
  );
}
