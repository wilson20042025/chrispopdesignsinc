import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getProjects, getCategories, getPosts } from '@/lib/data';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect('/admin/login');
  }

  const [projects, categories, posts] = await Promise.all([
    getProjects(),
    getCategories(),
    getPosts(),
  ]);

  return (
    <AdminDashboard
      initialProjects={projects}
      initialCategories={categories}
      initialPosts={posts}
    />
  );
}
