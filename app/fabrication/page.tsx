import ProjectsPreview from "../components/ProjectsPreview";
import Footer from "../components/Footer";

export default function FabricationPage() {
  return (
    <>
      <main className="pt-20 md:pt-24">
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
