import ProjectsPreview from "../components/ProjectsPreview";
import Footer from "../components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Works | Chris Pop Design Innovation",
  description: "Explore our complete portfolio spanning architectural design and advanced 3D fabrication.",
};

export const revalidate = 10;

export default function ProjectsPage() {
  return (
    <main className="min-h-screen pt-20">
      <ProjectsPreview isFullList={true} title={<span className="hidden"></span>} subtitle="" />
      <Footer />
    </main>
  );
}
