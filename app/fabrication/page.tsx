import ProjectsPreview from "../components/ProjectsPreview";
import Footer from "../components/Footer";

export default function FabricationPage() {
  return (
    <>
      <main className="pt-24 md:pt-40">
        <ProjectsPreview 
          category="fabrication" 
          title={<>Advanced <br />3D Fabrication</>} 
          subtitle="Precision Prototyping"
          isFullList={true}
        />
      </main>
      <Footer />
    </>
  );
}
