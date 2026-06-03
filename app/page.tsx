import Hero from "@/components/Hero";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import Certificates from "@/components/Certificates";
import ContributionGraph from "@/components/ContributionGraph";
import ProjectAlerts from "@/components/ProjectAlerts";

import connectToDatabase from "@/lib/cache";
import { ProjectState } from "@/models/ProjectState";
import { getLocalProjects } from "@/lib/localDb";

export default async function Home() {
  const conn = await connectToDatabase();
  let dbProjectsRaw: any[] = [];
  
  if (conn) {
    dbProjectsRaw = await ProjectState.find({ status: 'approved' }).sort({ updatedAt: -1 }).lean();
  } else {
    dbProjectsRaw = getLocalProjects()
      .filter(p => p.status === 'approved')
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }
  
  const dbProjects = dbProjectsRaw.map((p: any) => ({
    name: p.repoName,
    description: p.description || "",
    language: p.language || "Unknown",
    langColor: "#3178c6", // Default color
    topics: p.topics || []
  }));

  return (
    <div className="flex flex-col gap-4 pb-16 md:gap-16">
      <Hero />
      <div className="container mx-auto px-4 lg:px-8 space-y-24">
        <About />
        <TechStack />
        <Projects dbProjects={dbProjects} />
        <Certificates />
        <section id="activity" aria-label="GitHub Activity" className="scroll-mt-24">
          <ContributionGraph />
        </section>
      </div>
      <ProjectAlerts />
    </div>
  );
}
