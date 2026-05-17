import Hero from "@/components/Hero";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import Certificates from "@/components/Certificates";
import ContributionGraph from "@/components/ContributionGraph";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      <Hero />
      <div className="container mx-auto px-4 lg:px-8 space-y-24">
        <About />
        <TechStack />
        <Projects />
        <Certificates />
        <section>
          <h2 className="text-2xl font-normal text-[#e6edf3] mb-6">Activity</h2>
          <ContributionGraph />
        </section>
      </div>
    </div>
  );
}
