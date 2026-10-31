import fs from 'fs/promises';
import path from 'path';
import { Project, Category, BlogPost } from './types';
import { getRedisClient, REDIS_KEYS } from './redis';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');

async function ensureDataFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // ignore
  }

  const checkAndInit = async (filePath: string, defaultData: any) => {
    try {
      await fs.access(filePath);
    } catch {
      try {
        await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), 'utf8');
      } catch {
        // Read-only filesystem in serverless
      }
    }
  };

  await checkAndInit(PROJECTS_FILE, []);
  await checkAndInit(CATEGORIES_FILE, []);
  await checkAndInit(POSTS_FILE, []);
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// ---------------- LOW LEVEL STORAGE HELPERS (REDIS + LOCAL FALLBACK) ----------------

async function readLocalFile<T>(filePath: string): Promise<T[]> {
  try {
    await ensureDataFiles();
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

async function writeLocalFile<T>(filePath: string, data: T[]): Promise<void> {
  try {
    await ensureDataFiles();
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e: any) {
    // Gracefully ignore write errors on read-only serverless filesystems (e.g. Vercel)
    if (e.code !== 'EROFS') {
      console.error(`Error writing ${filePath}:`, e);
    }
  }
}

// Projects storage
async function readProjectsData(): Promise<Project[]> {
  const redis = getRedisClient();
  if (redis) {
    try {
      const data = await redis.get<Project[]>(REDIS_KEYS.PROJECTS);
      if (data !== null && Array.isArray(data)) {
        return data;
      }
      // Auto-seed Redis if key is null
      const localSeed = await readLocalFile<Project>(PROJECTS_FILE);
      await redis.set(REDIS_KEYS.PROJECTS, localSeed);
      return localSeed;
    } catch (err) {
      console.error('Redis readProjects error, falling back to local file:', err);
    }
  }
  return readLocalFile<Project>(PROJECTS_FILE);
}

async function writeProjectsData(projects: Project[]): Promise<void> {
  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.set(REDIS_KEYS.PROJECTS, projects);
    } catch (err) {
      console.error('Redis writeProjects error:', err);
    }
  }
  await writeLocalFile(PROJECTS_FILE, projects);
}

// Categories storage
async function readCategoriesData(): Promise<Category[]> {
  const redis = getRedisClient();
  if (redis) {
    try {
      const data = await redis.get<Category[]>(REDIS_KEYS.CATEGORIES);
      if (data !== null && Array.isArray(data)) {
        return data;
      }
      // Auto-seed Redis if key is null
      const localSeed = await readLocalFile<Category>(CATEGORIES_FILE);
      await redis.set(REDIS_KEYS.CATEGORIES, localSeed);
      return localSeed;
    } catch (err) {
      console.error('Redis readCategories error, falling back to local file:', err);
    }
  }
  return readLocalFile<Category>(CATEGORIES_FILE);
}

async function writeCategoriesData(categories: Category[]): Promise<void> {
  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.set(REDIS_KEYS.CATEGORIES, categories);
    } catch (err) {
      console.error('Redis writeCategories error:', err);
    }
  }
  await writeLocalFile(CATEGORIES_FILE, categories);
}

// Posts storage
async function readPostsData(): Promise<BlogPost[]> {
  const redis = getRedisClient();
  if (redis) {
    try {
      const data = await redis.get<BlogPost[]>(REDIS_KEYS.POSTS);
      if (data !== null && Array.isArray(data)) {
        return data;
      }
      // Auto-seed Redis if key is null
      const localSeed = await readLocalFile<BlogPost>(POSTS_FILE);
      await redis.set(REDIS_KEYS.POSTS, localSeed);
      return localSeed;
    } catch (err) {
      console.error('Redis readPosts error, falling back to local file:', err);
    }
  }
  return readLocalFile<BlogPost>(POSTS_FILE);
}

async function writePostsData(posts: BlogPost[]): Promise<void> {
  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.set(REDIS_KEYS.POSTS, posts);
    } catch (err) {
      console.error('Redis writePosts error:', err);
    }
  }
  await writeLocalFile(POSTS_FILE, posts);
}

// ---------------- PUBLIC API: PROJECTS ----------------

export async function getProjects(): Promise<Project[]> {
  const projects = await readProjectsData();
  return projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) || null;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.id === id) || null;
}

export async function saveProject(data: Partial<Project> & { title: string }): Promise<Project> {
  const projects = await getProjects();
  const now = new Date().toISOString();

  let project: Project;

  if (data.id) {
    const index = projects.findIndex((p) => p.id === data.id);
    if (index === -1) {
      throw new Error(`Project with ID ${data.id} not found.`);
    }

    const existing = projects[index];
    const generatedSlug = data.slug ? slugify(data.slug) : (existing.slug || slugify(data.title));

    project = {
      ...existing,
      ...data,
      id: existing.id,
      title: data.title,
      slug: generatedSlug,
      category: data.category || existing.category || 'architecture',
      categoryTitle: data.categoryTitle || (data.category ? data.category.charAt(0).toUpperCase() + data.category.slice(1) : existing.categoryTitle),
      summary: data.summary ?? existing.summary ?? '',
      images: Array.isArray(data.images) ? data.images : existing.images || [],
      details: Array.isArray(data.details) ? data.details : existing.details || [],
      updatedAt: now,
      featured: data.featured !== undefined ? data.featured : existing.featured,
    };
    projects[index] = project;
  } else {
    const baseSlug = data.slug ? slugify(data.slug) : slugify(data.title);
    let finalSlug = baseSlug;
    let counter = 1;
    while (projects.some((p) => p.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    project = {
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: data.title,
      slug: finalSlug,
      category: data.category || 'architecture',
      categoryTitle: data.categoryTitle || (data.category ? data.category.charAt(0).toUpperCase() + data.category.slice(1) : 'Architecture'),
      summary: data.summary || '',
      images: Array.isArray(data.images) ? data.images : [],
      details: Array.isArray(data.details) ? data.details : [],
      createdAt: now,
      updatedAt: now,
      featured: !!data.featured,
    };
    projects.unshift(project);
  }

  await writeProjectsData(projects);
  return project;
}

export async function deleteProject(id: string): Promise<boolean> {
  const projects = await getProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) return false;
  await writeProjectsData(filtered);
  return true;
}

// ---------------- PUBLIC API: CATEGORIES ----------------

export async function getCategories(): Promise<Category[]> {
  const categories = await readCategoriesData();
  return categories.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) || null;
}

export async function saveCategory(data: Partial<Category> & { title: string }): Promise<Category> {
  const categories = await getCategories();
  const now = new Date().toISOString();

  let category: Category;

  if (data.id) {
    const index = categories.findIndex((c) => c.id === data.id);
    if (index === -1) throw new Error(`Category with ID ${data.id} not found.`);
    const existing = categories[index];
    category = {
      ...existing,
      ...data,
      id: existing.id,
      title: data.title,
      slug: data.slug ? slugify(data.slug) : existing.slug,
      subtitle: data.subtitle ?? existing.subtitle,
      coverImage: data.coverImage ?? existing.coverImage,
    };
    categories[index] = category;
  } else {
    const baseSlug = data.slug ? slugify(data.slug) : slugify(data.title);
    let finalSlug = baseSlug;
    let counter = 1;
    while (categories.some((c) => c.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    category = {
      id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: data.title,
      slug: finalSlug,
      subtitle: data.subtitle || '',
      coverImage: data.coverImage || '',
      createdAt: now,
    };
    categories.push(category);
  }

  await writeCategoriesData(categories);
  return category;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const categories = await getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  if (filtered.length === categories.length) return false;
  await writeCategoriesData(filtered);
  return true;
}

// ---------------- PUBLIC API: BLOG POSTS ----------------

export async function getPosts(): Promise<BlogPost[]> {
  const posts = await readPostsData();
  return posts.sort((a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime());
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) || null;
}

export async function savePost(data: Partial<BlogPost> & { title: string }): Promise<BlogPost> {
  const posts = await getPosts();
  const now = new Date().toISOString();

  let post: BlogPost;

  if (data.id) {
    const index = posts.findIndex((p) => p.id === data.id);
    if (index === -1) throw new Error(`Post with ID ${data.id} not found.`);
    const existing = posts[index];
    post = {
      ...existing,
      ...data,
      id: existing.id,
      title: data.title,
      slug: data.slug ? slugify(data.slug) : existing.slug,
      date: data.date || existing.date || now,
      category: data.category || existing.category || 'Architecture',
      excerpt: data.excerpt ?? existing.excerpt ?? '',
      image: data.image ?? existing.image ?? '',
      body: data.body ?? existing.body ?? '',
    };
    posts[index] = post;
  } else {
    const baseSlug = data.slug ? slugify(data.slug) : slugify(data.title);
    let finalSlug = baseSlug;
    let counter = 1;
    while (posts.some((p) => p.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    post = {
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: data.title,
      slug: finalSlug,
      date: data.date || now,
      category: data.category || 'Architecture',
      excerpt: data.excerpt || '',
      image: data.image || '',
      body: data.body || '',
      createdAt: now,
    };
    posts.unshift(post);
  }

  await writePostsData(posts);
  return post;
}

export async function deletePost(id: string): Promise<boolean> {
  const posts = await getPosts();
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) return false;
  await writePostsData(filtered);
  return true;
}
