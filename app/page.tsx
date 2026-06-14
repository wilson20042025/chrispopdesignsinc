import Hero from "./components/Hero";
import Narrative from "./components/Narrative";
import ProjectsPreview from "./components/ProjectsPreview";
import Pricing from "./components/Pricing";
import BlogPreview from "./components/BlogPreview";
import Footer from "./components/Footer";

export const revalidate = 10;

export default function Home() {
  return (
    <>
      <Hero />
      <Narrative />
      <ProjectsPreview id="projects" subtitle="What We Do?" />
      <Pricing />
      <BlogPreview />
      <Footer />
    </>
  );
}
