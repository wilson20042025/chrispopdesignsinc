import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel | ChrisPop Designs Inc.',
  description: 'Manage architecture projects, images, categories, and articles.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0f0f12] text-neutral-100 antialiased selection:bg-white selection:text-black">
      {children}
    </div>
  );
}
