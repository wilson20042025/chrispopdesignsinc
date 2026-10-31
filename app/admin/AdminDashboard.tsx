"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Project, Category, BlogPost } from '@/lib/types';

interface AdminDashboardProps {
  initialProjects: Project[];
  initialCategories: Category[];
  initialPosts: BlogPost[];
}

export default function AdminDashboard({
  initialProjects,
  initialCategories,
  initialPosts,
}: AdminDashboardProps) {
  const router = useRouter();

  // Data
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);

  // Active view: 'projects', 'categories', or 'posts'
  const [activeTab, setActiveTab] = useState<'projects' | 'categories' | 'posts'>('projects');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Project Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Partial<Project> | null>(null);

  // Category Modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Partial<Category> | null>(null);

  // Inline Category Creator (Inside Project Modal)
  const [isAddingInlineCategory, setIsAddingInlineCategory] = useState(false);
  const [inlineCategoryTitle, setInlineCategoryTitle] = useState('');
  const [inlineCategorySubtitle, setInlineCategorySubtitle] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // Post Modal
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<Partial<BlogPost> | null>(null);

  // Uploading state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } finally {
      router.push('/admin/login');
      router.refresh();
    }
  };

  // Helper: icon for category
  const getCategoryIcon = (slug?: string) => {
    if (!slug) return '🏷️';
    const s = slug.toLowerCase();
    if (s.includes('arch')) return '🏛️';
    if (s.includes('fab') || s.includes('3d')) return '⚙️';
    if (s.includes('interior')) return '🛋️';
    if (s.includes('land') || s.includes('urban') || s.includes('green')) return '🌳';
    if (s.includes('residen') || s.includes('house') || s.includes('villa')) return '🏡';
    if (s.includes('commerc') || s.includes('office') || s.includes('tower')) return '🏢';
    return '🏷️';
  };

  // ---------------- PROJECT ACTIONS ----------------

  const handleOpenNewProject = () => {
    const defaultCat = categories[0]?.slug || 'architecture';
    const defaultCatObj = categories.find((c) => c.slug === defaultCat);
    setProjectToEdit({
      title: '',
      category: defaultCat,
      categoryTitle: defaultCatObj?.title || 'Architecture',
      images: [],
      details: [],
    });
    setUploadError('');
    setIsAddingInlineCategory(false);
    setInlineCategoryTitle('');
    setInlineCategorySubtitle('');
    setIsModalOpen(true);
  };

  const handleOpenEditProject = (project: Project) => {
    setProjectToEdit({
      ...project,
      images: [...(project.images || [])],
      details: project.details ? project.details.map((d) => ({ ...d })) : [],
    });
    setUploadError('');
    setIsAddingInlineCategory(false);
    setInlineCategoryTitle('');
    setInlineCategorySubtitle('');
    setIsModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectToEdit?.title?.trim()) {
      alert('Please enter a project name.');
      return;
    }

    setIsSaving(true);
    try {
      // Auto-generate clean slug in background if needed
      const autoSlug = projectToEdit.slug || projectToEdit.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Optional details cleaned up (ignore empty rows)
      const cleanDetails = (projectToEdit.details || [])
        .filter((d) => d.label?.trim() || d.value?.trim())
        .map((d) => ({
          label: d.label?.trim() || '',
          value: d.value?.trim() || '',
        }));

      const selectedCategoryObj = categories.find((c) => c.slug === projectToEdit.category);
      const payload = {
        ...projectToEdit,
        slug: autoSlug,
        category: projectToEdit.category || categories[0]?.slug || 'architecture',
        categoryTitle: selectedCategoryObj?.title || projectToEdit.categoryTitle || 'Architecture',
        details: cleanDetails,
      };

      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save project');
      }

      const saved: Project = data.project;
      setProjects((prev) => {
        const index = prev.findIndex((p) => p.id === saved.id);
        if (index >= 0) {
          const next = [...prev];
          next[index] = saved;
          return next;
        }
        return [saved, ...prev];
      });

      setIsModalOpen(false);
      setProjectToEdit(null);
      showToast('✅ Project saved and published to website!');
    } catch (err: any) {
      alert(err.message || 'Error saving project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/projects?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed');

      setProjects((prev) => prev.filter((p) => p.id !== id));
      showToast('🗑️ Project deleted.');
    } catch (err: any) {
      alert(err.message || 'Error deleting project');
    }
  };

  // Upload Photos
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      if (data.urls && data.urls.length > 0) {
        setProjectToEdit((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            images: [...(prev.images || []), ...data.urls],
          };
        });
        showToast(`📷 ${data.urls.length} photo(s) uploaded!`);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Could not upload photos');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleMakeCoverPhoto = (index: number) => {
    if (index === 0) return;
    setProjectToEdit((prev) => {
      if (!prev) return prev;
      const images = [...(prev.images || [])];
      const [chosen] = images.splice(index, 1);
      images.unshift(chosen);
      return { ...prev, images };
    });
    showToast('⭐ Main cover photo updated!');
  };

  const handleRemovePhoto = (index: number) => {
    setProjectToEdit((prev) => {
      if (!prev) return prev;
      const images = [...(prev.images || [])];
      images.splice(index, 1);
      return { ...prev, images };
    });
  };

  // ---------------- PROJECT SPECIFICATIONS / DETAILS ----------------

  const handleAddDetail = (label = '', value = '') => {
    setProjectToEdit((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        details: [...(prev.details || []), { label, value }],
      };
    });
  };

  const handleUpdateDetail = (index: number, field: 'label' | 'value', value: string) => {
    setProjectToEdit((prev) => {
      if (!prev) return prev;
      const nextDetails = [...(prev.details || [])];
      nextDetails[index] = {
        ...nextDetails[index],
        [field]: value,
      };
      return {
        ...prev,
        details: nextDetails,
      };
    });
  };

  const handleRemoveDetail = (index: number) => {
    setProjectToEdit((prev) => {
      if (!prev) return prev;
      const nextDetails = [...(prev.details || [])];
      nextDetails.splice(index, 1);
      return {
        ...prev,
        details: nextDetails,
      };
    });
  };

  // ---------------- ARTICLES ACTIONS ----------------

  const handleOpenNewPost = () => {
    setPostToEdit({
      title: '',
      category: 'Architecture',
      date: new Date().toISOString(),
      excerpt: '',
      image: '',
      body: '',
    });
    setIsPostModalOpen(true);
  };

  const handleOpenEditPost = (post: BlogPost) => {
    setPostToEdit({ ...post });
    setIsPostModalOpen(true);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postToEdit?.title?.trim()) {
      alert('Please enter an article title.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postToEdit),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed');

      const saved: BlogPost = data.post;
      setPosts((prev) => {
        const index = prev.findIndex((p) => p.id === saved.id);
        if (index >= 0) {
          const next = [...prev];
          next[index] = saved;
          return next;
        }
        return [saved, ...prev];
      });

      setIsPostModalOpen(false);
      setPostToEdit(null);
      showToast('✅ Article saved!');
    } catch (err: any) {
      alert(err.message || 'Error saving post');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePost = async (id: string, title: string) => {
    if (!confirm(`Delete article "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/posts?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed');

      setPosts((prev) => prev.filter((p) => p.id !== id));
      showToast('🗑️ Article deleted.');
    } catch (err: any) {
      alert(err.message || 'Error deleting article');
    }
  };

  // ---------------- CATEGORIES ACTIONS ----------------

  const handleOpenNewCategory = () => {
    setCategoryToEdit({
      title: '',
      subtitle: '',
      coverImage: '',
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (category: Category) => {
    setCategoryToEdit({ ...category });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryToEdit?.title?.trim()) {
      alert('Please enter a category title.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryToEdit),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save category');

      const saved: Category = data.category;
      setCategories((prev) => {
        const index = prev.findIndex((c) => c.id === saved.id);
        if (index >= 0) {
          const next = [...prev];
          next[index] = saved;
          return next;
        }
        return [...prev, saved];
      });

      setIsCategoryModalOpen(false);
      setCategoryToEdit(null);
      showToast('✅ Category saved successfully!');
    } catch (err: any) {
      alert(err.message || 'Error saving category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string, title: string, slug: string) => {
    const assignedCount = projects.filter((p) => p.category?.toLowerCase() === slug.toLowerCase()).length;
    const confirmMessage = assignedCount > 0
      ? `"${title}" has ${assignedCount} project(s) assigned to it. Are you sure you want to delete this category?`
      : `Delete category "${title}"?`;

    if (!confirm(confirmMessage)) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed');

      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast('🗑️ Category deleted.');
    } catch (err: any) {
      alert(err.message || 'Error deleting category');
    }
  };

  const handleCreateInlineCategory = async () => {
    const title = inlineCategoryTitle.trim();
    if (!title) {
      alert('Please enter a category name');
      return;
    }

    setIsCreatingCategory(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle: inlineCategorySubtitle.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to create category');

      const saved: Category = data.category;
      setCategories((prev) => {
        if (prev.some((c) => c.id === saved.id || c.slug === saved.slug)) return prev;
        return [...prev, saved];
      });

      // Automatically assign the newly created category to the project
      setProjectToEdit((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          category: saved.slug,
          categoryTitle: saved.title,
        };
      });

      setInlineCategoryTitle('');
      setInlineCategorySubtitle('');
      setIsAddingInlineCategory(false);
      showToast(`✅ Created "${saved.title}" and assigned to this project!`);
    } catch (err: any) {
      alert(err.message || 'Error creating category');
    } finally {
      setIsCreatingCategory(false);
    }
  };

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category?.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#111215] text-white font-sans selection:bg-white selection:text-black">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[999] bg-emerald-500 text-black px-6 py-3 rounded-lg shadow-2xl text-sm font-semibold flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Clean Top Navigation Bar */}
      <header className="bg-[#181920] border-b border-white/10 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center p-1.5">
              <Image
                src="/chrispop(thumbnail).png"
                alt="ChrisPop Logo"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-wide text-white">ChrisPop Website Manager</h1>
              <p className="text-xs text-white/50">Manage your portfolio projects and photos</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-medium text-white rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>View Website</span>
              <span className="text-sm">↗</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Simple Tab Switcher */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'projects'
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🏛️ Architecture Projects</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'projects' ? 'bg-black/10 text-black' : 'bg-white/10 text-white'}`}>
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'categories'
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🏷️ Categories</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'categories' ? 'bg-black/10 text-black' : 'bg-white/10 text-white'}`}>
              {categories.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'posts'
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>✍️ Articles & Insights</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'posts' ? 'bg-black/10 text-black' : 'bg-white/10 text-white'}`}>
              {posts.length}
            </span>
          </button>
        </div>

        {/* ===================== TAB 1: PROJECTS ===================== */}
        {activeTab === 'projects' && (
          <div>
            {/* Top Action Header */}
            <div className="bg-[#181920] border border-white/10 rounded-xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Your Projects</h2>
                <p className="text-sm text-white/50 mt-1">
                  Upload project photos and organize your architecture works.
                </p>
              </div>

              {/* Big, friendly "+ Add New Project" button */}
              <button
                onClick={handleOpenNewProject}
                className="w-full md:w-auto px-6 py-3.5 bg-white text-black text-sm font-bold rounded-lg hover:bg-neutral-200 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer"
              >
                <span className="text-lg leading-none">+</span>
                <span>Add New Project</span>
              </button>
            </div>

            {/* Search and Category Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 Search projects by name..."
                  className="w-full px-4 py-3 bg-[#181920] border border-white/15 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-4 py-2.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                    categoryFilter === 'all'
                      ? 'bg-white text-black border-white font-semibold'
                      : 'bg-[#181920] text-white/60 border-white/15 hover:text-white'
                  }`}
                >
                  All Projects ({projects.length})
                </button>
                {categories.map((cat) => {
                  const count = projects.filter((p) => p.category?.toLowerCase() === cat.slug.toLowerCase()).length;
                  const isActive = categoryFilter.toLowerCase() === cat.slug.toLowerCase();
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.slug)}
                      className={`px-4 py-2.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-white text-black border-white font-semibold'
                          : 'bg-[#181920] text-white/60 border-white/15 hover:text-white'
                      }`}
                    >
                      <span>{getCategoryIcon(cat.slug)}</span>
                      <span>{cat.title} ({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
              <div className="bg-[#181920] border border-dashed border-white/15 rounded-xl p-16 text-center">
                <div className="text-4xl mb-3">📁</div>
                <h3 className="text-base font-semibold text-white">No projects found</h3>
                <p className="text-xs text-white/50 mt-1">Get started by creating your first architecture project.</p>
                <button
                  onClick={handleOpenNewProject}
                  className="mt-5 px-5 py-2.5 bg-white text-black text-xs font-bold rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  + Add Project Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => {
                  const coverPhoto = project.images?.[0] || '/modern_architectural_innovation_building_1775931655490.png';
                  return (
                    <div
                      key={project.id}
                      className="bg-[#181920] border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between hover:border-white/30 transition-all shadow-md group"
                    >
                      {/* Photo Thumbnail */}
                      <div className="relative aspect-[16/10] bg-black/50 overflow-hidden">
                        <Image
                          src={coverPhoto}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {(() => {
                          const catObj = categories.find((c) => c.slug.toLowerCase() === project.category?.toLowerCase());
                          const label = catObj?.title || project.categoryTitle || project.category || 'Architecture';
                          return (
                            <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 text-xs font-medium text-white rounded flex items-center gap-1.5">
                              <span>{getCategoryIcon(project.category)}</span>
                              <span>{label}</span>
                            </div>
                          );
                        })()}
                        <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md px-2 py-0.5 text-xs text-white/90 rounded">
                          📷 {project.images?.length || 0} photos
                        </div>
                      </div>

                      {/* Card Information */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-white line-clamp-1 mb-1">
                            {project.title}
                          </h3>
                          <p className="text-xs text-white/40 font-mono">
                            Added: {new Date(project.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-5 mt-4 border-t border-white/10 flex items-center justify-between gap-2">
                          <Link
                            href={`/our-work/${project.slug}`}
                            target="_blank"
                            className="text-xs text-white/70 hover:text-white transition-colors flex items-center gap-1"
                          >
                            <span>View Live</span>
                            <span>↗</span>
                          </Link>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenEditProject(project)}
                              className="px-3 py-1.5 bg-white/10 hover:bg-white hover:text-black text-white text-xs font-medium rounded transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id, project.title)}
                              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-medium rounded transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 2: CATEGORIES ===================== */}
        {activeTab === 'categories' && (
          <div>
            <div className="bg-[#181920] border border-white/10 rounded-xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Project Categories</h2>
                <p className="text-sm text-white/50 mt-1">
                  Manage the categories and disciplines your projects fall under.
                </p>
              </div>

              <button
                onClick={handleOpenNewCategory}
                className="w-full md:w-auto px-6 py-3.5 bg-white text-black text-sm font-bold rounded-lg hover:bg-neutral-200 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer"
              >
                <span className="text-lg leading-none">+</span>
                <span>Add New Category</span>
              </button>
            </div>

            {categories.length === 0 ? (
              <div className="bg-[#181920] border border-dashed border-white/15 rounded-xl p-16 text-center">
                <div className="text-4xl mb-3">🏷️</div>
                <h3 className="text-base font-semibold text-white">No categories created yet</h3>
                <p className="text-xs text-white/50 mt-1">Create your first category for your projects.</p>
                <button
                  onClick={handleOpenNewCategory}
                  className="mt-5 px-5 py-2.5 bg-white text-black text-xs font-bold rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  + Add Category Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => {
                  const projectCount = projects.filter(
                    (p) => p.category?.toLowerCase() === cat.slug.toLowerCase()
                  ).length;
                  const firstProjectWithImage = projects.find(
                    (p) => p.category?.toLowerCase() === cat.slug.toLowerCase() && p.images?.length > 0
                  );
                  const displayImage = cat.coverImage || firstProjectWithImage?.images?.[0] || '/modern_architectural_innovation_building_1775931655490.png';

                  return (
                    <div
                      key={cat.id}
                      className="bg-[#181920] border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between hover:border-white/30 transition-all shadow-md group"
                    >
                      <div className="relative aspect-[16/9] bg-black/50 overflow-hidden">
                        <Image
                          src={displayImage}
                          alt={cat.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 text-xs font-medium text-white rounded flex items-center gap-1.5">
                          <span>{getCategoryIcon(cat.slug)}</span>
                          <span>{cat.title}</span>
                        </div>
                        <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md px-2 py-0.5 text-xs text-white/90 rounded">
                          📁 {projectCount} {projectCount === 1 ? 'project' : 'projects'}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3 className="text-base font-semibold text-white">{cat.title}</h3>
                            <span className="text-[11px] font-mono text-white/40">/{cat.slug}</span>
                          </div>
                          {cat.subtitle && (
                            <p className="text-xs text-white/60 mb-2 italic">{cat.subtitle}</p>
                          )}
                          <p className="text-xs text-white/40">
                            {projectCount === 0
                              ? 'No projects tagged yet'
                              : `${projectCount} project${projectCount > 1 ? 's' : ''} in this category`}
                          </p>
                        </div>

                        <div className="pt-5 mt-4 border-t border-white/10 flex items-center justify-between gap-2">
                          <Link
                            href={`/our-work/category/${cat.slug}`}
                            target="_blank"
                            className="text-xs text-white/70 hover:text-white transition-colors flex items-center gap-1"
                          >
                            <span>View Live</span>
                            <span>↗</span>
                          </Link>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenEditCategory(cat)}
                              className="px-3 py-1.5 bg-white/10 hover:bg-white hover:text-black text-white text-xs font-medium rounded transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id, cat.title, cat.slug)}
                              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-medium rounded transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 3: ARTICLES / BLOG ===================== */}
        {activeTab === 'posts' && (
          <div>
            <div className="bg-[#181920] border border-white/10 rounded-xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Articles & Insights</h2>
                <p className="text-sm text-white/50 mt-1">Publish stories, thoughts, and updates on your website.</p>
              </div>

              <button
                onClick={handleOpenNewPost}
                className="px-6 py-3 bg-white text-black text-sm font-bold rounded-lg hover:bg-neutral-200 transition-all cursor-pointer"
              >
                + Write New Article
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-[#181920] border border-white/10 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    {post.image && (
                      <div className="relative aspect-[16/9] mb-4 bg-black/40 rounded-lg overflow-hidden">
                        <Image src={post.image} alt={post.title} fill className="object-cover" />
                      </div>
                    )}
                    <span className="text-xs text-white/40 block mb-1">{post.category}</span>
                    <h3 className="text-base font-semibold text-white line-clamp-2 mb-2">{post.title}</h3>
                    <p className="text-xs text-white/50 line-clamp-3 leading-relaxed mb-4">{post.excerpt}</p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="text-xs text-white/60 hover:text-white"
                    >
                      Read Live ↗
                    </Link>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEditPost(post)}
                        className="px-3 py-1 bg-white/10 hover:bg-white hover:text-black text-xs rounded text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id, post.title)}
                        className="px-3 py-1 bg-red-500/10 text-red-300 text-xs rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* ================= SIMPLE PROJECT EDITOR POPUP ================ */}
      {/* ============================================================== */}
      {isModalOpen && projectToEdit && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#181920] border border-white/20 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative my-auto overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#1e2029]">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {projectToEdit.id ? 'Edit Project' : 'Add New Project'}
                </h2>
                <p className="text-xs text-white/50">Follow the 3 easy steps below</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/40 hover:text-white text-2xl font-light leading-none p-2 cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveProject} className="p-6 overflow-y-auto space-y-6">
              {/* STEP 1: Title */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-white mb-2">
                  1. Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={projectToEdit.title || ''}
                  onChange={(e) => setProjectToEdit((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Modern Glass Villa"
                  className="w-full px-4 py-3 bg-[#111215] border border-white/15 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              {/* STEP 2: Category Selector */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white">
                    2. Choose Category *
                  </label>
                  {!isAddingInlineCategory && (
                    <button
                      type="button"
                      onClick={() => setIsAddingInlineCategory(true)}
                      className="text-xs text-white/60 hover:text-white underline cursor-pointer"
                    >
                      + Add New Category
                    </button>
                  )}
                </div>

                {isAddingInlineCategory && (
                  <div className="mb-4 p-3 bg-[#111215] border border-white/20 rounded-lg space-y-2">
                    <span className="text-xs font-semibold text-white block">Create New Category</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inlineCategoryTitle}
                        onChange={(e) => setInlineCategoryTitle(e.target.value)}
                        placeholder="Category Name (e.g. Interior Design)"
                        className="flex-1 px-3 py-1.5 bg-[#181920] border border-white/15 rounded text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={handleCreateInlineCategory}
                        disabled={isCreatingCategory}
                        className="px-3 py-1.5 bg-white text-black text-xs font-bold rounded hover:bg-neutral-200 cursor-pointer disabled:opacity-50"
                      >
                        {isCreatingCategory ? 'Adding...' : 'Add'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingInlineCategory(false);
                          setInlineCategoryTitle('');
                        }}
                        className="px-2 py-1.5 text-white/50 hover:text-white text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {categories.map((cat) => {
                    const isSelected = (projectToEdit.category || '').toLowerCase() === cat.slug.toLowerCase();
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setProjectToEdit((prev) => ({
                          ...prev,
                          category: cat.slug,
                          categoryTitle: cat.title,
                        }))}
                        className={`py-2.5 px-3 rounded-lg border text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-white text-black border-white font-bold shadow-md'
                            : 'bg-[#111215] text-white/60 border-white/15 hover:text-white'
                        }`}
                      >
                        <span>{getCategoryIcon(cat.slug)}</span>
                        <span className="truncate">{cat.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 3: Photos Uploader */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-white mb-2">
                  3. Project Photos ({projectToEdit.images?.length || 0})
                </label>
                <p className="text-xs text-white/50 mb-4">
                  Upload photos of this project. The first photo with the ⭐ badge is your main cover photo.
                </p>

                {/* Big Drag and Drop / Upload Button */}
                <label className="border-2 border-dashed border-white/20 hover:border-white/50 rounded-xl p-6 text-center block cursor-pointer bg-[#111215] transition-colors mb-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="text-3xl mb-2">📸</div>
                  <span className="text-sm font-semibold text-white block">
                    Click here to choose photos from your device
                  </span>
                  <span className="text-xs text-white/40 block mt-1">
                    (You can select multiple photos at once)
                  </span>
                </label>

                {isUploading && (
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs text-center rounded-lg mb-4 animate-pulse">
                    Uploading your photos... please wait a moment.
                  </div>
                )}
                {uploadError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-lg mb-4">
                    {uploadError}
                  </div>
                )}

                {/* Photos Preview Grid */}
                {projectToEdit.images && projectToEdit.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {projectToEdit.images.map((imgUrl, index) => {
                      const isCover = index === 0;
                      return (
                        <div
                          key={index}
                          className={`relative rounded-lg overflow-hidden border bg-black flex flex-col ${
                            isCover ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-white/10'
                          }`}
                        >
                          <div className="relative aspect-[4/3] w-full">
                            <Image src={imgUrl} alt={`Photo ${index + 1}`} fill className="object-cover" />
                            {isCover && (
                              <div className="absolute top-2 left-2 bg-amber-400 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow">
                                ⭐ Cover Photo
                              </div>
                            )}
                          </div>

                          <div className="p-2 bg-[#181920] flex items-center justify-between text-xs">
                            {!isCover ? (
                              <button
                                type="button"
                                onClick={() => handleMakeCoverPhoto(index)}
                                className="text-amber-300 hover:text-white text-[11px] font-medium"
                              >
                                Set as cover
                              </button>
                            ) : (
                              <span className="text-amber-400 text-[11px] font-medium">Main cover</span>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(index)}
                              className="text-red-400 hover:text-red-300 text-[11px] font-bold"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-xs text-white/30 italic py-2">
                    No photos added yet. Click the box above to add photos.
                  </p>
                )}
              </div>

              {/* STEP 4: Project Specifications (Optional) */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white">
                      4. Project Specifications <span className="text-white/40 font-normal lowercase">(optional)</span>
                    </label>
                    <p className="text-xs text-white/50 mt-0.5">
                      Add details such as typology, year, location, materials, or custom specs.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddDetail('', '')}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white hover:text-black text-white text-xs font-medium rounded transition-colors flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                  >
                    <span>+ Add Field</span>
                  </button>
                </div>

                {/* Quick Preset Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 my-3">
                  <span className="text-[11px] text-white/40 mr-1">Quick Add:</span>
                  {['Typology', 'Year', 'Location', 'Materials', 'Methodology', 'Client', 'Area'].map((preset) => {
                    const alreadyExists = (projectToEdit.details || []).some(
                      (d) => d.label.toLowerCase() === preset.toLowerCase()
                    );
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleAddDetail(preset, '')}
                        disabled={alreadyExists}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                          alreadyExists
                            ? 'bg-white/5 border-white/5 text-white/30 cursor-not-allowed'
                            : 'bg-white/10 border-white/15 text-white/80 hover:bg-white hover:text-black hover:border-white'
                        }`}
                      >
                        + {preset}
                      </button>
                    );
                  })}
                </div>

                {/* Details List */}
                {projectToEdit.details && projectToEdit.details.length > 0 ? (
                  <div className="space-y-2 mt-3">
                    {projectToEdit.details.map((detail, index) => (
                      <div key={index} className="flex items-center gap-2 bg-[#111215] p-2 rounded-lg border border-white/10">
                        <div className="w-1/3">
                          <input
                            type="text"
                            value={detail.label}
                            onChange={(e) => handleUpdateDetail(index, 'label', e.target.value)}
                            placeholder="Field (e.g. Typology)"
                            className="w-full px-3 py-1.5 bg-transparent border border-white/10 rounded text-xs text-white placeholder-white/30 focus:outline-none focus:border-white font-medium"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={detail.value}
                            onChange={(e) => handleUpdateDetail(index, 'value', e.target.value)}
                            placeholder="Value (e.g. Cultural Pavilion)"
                            className="w-full px-3 py-1.5 bg-transparent border border-white/10 rounded text-xs text-white placeholder-white/30 focus:outline-none focus:border-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDetail(index)}
                          className="px-2 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors text-xs cursor-pointer"
                          title="Remove row"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-white/10 rounded-lg p-4 text-center text-xs text-white/40">
                    No specifications added yet. Click one of the quick presets above or click &quot;+ Add Field&quot; to add specifications.
                  </div>
                )}
              </div>

              {/* Bottom Buttons */}
              <div className="pt-4 border-t border-white/10 flex justify-end gap-3 sticky bottom-0 bg-[#181920] py-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="px-6 py-2.5 bg-white text-black text-xs font-bold rounded-lg hover:bg-neutral-200 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isSaving ? 'Saving Project...' : '✅ Save & Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ================= SIMPLE ARTICLE POPUP ======================= */}
      {/* ============================================================== */}
      {isPostModalOpen && postToEdit && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181920] border border-white/20 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#1e2029]">
              <h2 className="text-base font-bold text-white">
                {postToEdit.id ? 'Edit Article' : 'Write New Article'}
              </h2>
              <button onClick={() => setIsPostModalOpen(false)} className="text-white/40 hover:text-white text-2xl">
                ×
              </button>
            </div>

            <form onSubmit={handleSavePost} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={postToEdit.title || ''}
                  onChange={(e) => setPostToEdit((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Modern Innovations in Architecture"
                  className="w-full px-3 py-2.5 bg-[#111215] border border-white/15 rounded-lg text-sm text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={postToEdit.image || ''}
                  onChange={(e) => setPostToEdit((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="/modern_architectural_innovation_building_1775931655490.png"
                  className="w-full px-3 py-2 bg-[#111215] border border-white/15 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Short Summary (1-2 sentences)</label>
                <textarea
                  rows={2}
                  value={postToEdit.excerpt || ''}
                  onChange={(e) => setPostToEdit((prev) => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief preview shown on the blog feed..."
                  className="w-full px-3 py-2 bg-[#111215] border border-white/15 rounded-lg text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Full Article Text</label>
                <textarea
                  rows={5}
                  value={postToEdit.body || ''}
                  onChange={(e) => setPostToEdit((prev) => ({ ...prev, body: e.target.value }))}
                  placeholder="Write the article paragraphs here..."
                  className="w-full px-3 py-2 bg-[#111215] border border-white/15 rounded-lg text-xs text-white focus:outline-none focus:border-white leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 bg-white/10 rounded-lg text-xs font-medium text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-neutral-200"
                >
                  {isSaving ? 'Saving...' : 'Save Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
