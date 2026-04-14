import ProjectsPreview from "../components/ProjectsPreview";
import Footer from "../components/Footer";

export default function ArchitecturePage() {
  return (
    <>
      <main className="pt-24 md:pt-40">
        <ProjectsPreview 
          category="architecture" 
          title={<>Architectural <br />Design & Strategy</>} 
          subtitle="Spatial Innovation"
          isFullList={true}
        />
      </main>
      <Footer />
    </>
  );
}
