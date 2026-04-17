import Advantage from "@/components/home/Advantage";
import CTA from "@/components/home/CTA";
import Faculty from "@/components/home/Faculty";
import Hero from "@/components/home/Hero";
import Programs from "@/components/home/Programs";

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
