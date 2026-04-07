import Header from "./components/Header";
import Hero from "./components/Hero";
import Narrative from "./components/Narrative";
import ProjectsPreview from "./components/ProjectsPreview";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Narrative />
      <ProjectsPreview />
      <Footer />
    </>
  );
}
