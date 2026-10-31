export interface ProjectDetailItem {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string; // e.g. 'architecture' | 'fabrication'
  categoryTitle?: string;
  summary?: string;
  images: string[]; // Paths or URLs
  details?: ProjectDetailItem[];
  createdAt: string;
  updatedAt?: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  coverImage?: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  body: string;
  createdAt: string;
}
