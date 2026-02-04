// Blog and Comments types for the Site API

export interface BlogCategory {
  id: number;
  slug: string;
  title: string;
  title_ar: string;
  title_en: string;
  name?: string;
  name_ar?: string;
  name_en?: string;
}

export interface BlogPostListItem {
  id: number;
  slug: string;
  title: string;
  title_ar: string;
  title_en: string;
  summary?: string;
  summary_ar?: string;
  summary_en?: string;
  excerpt?: string;
  excerpt_ar?: string;
  excerpt_en?: string;
  image?: string;
  photo?: string;
  created_at: string;
  updated_at?: string;
  category?: BlogCategory;
  author?: {
    id: number;
    name: string;
  };
}

export interface Comment {
  id: number;
  author_name: string;
  author_email?: string;
  body: string;
  status?: string; // 'approved' | 'pending' | 'rejected'
  created_at: string;
  replies?: Comment[];
}

export interface BlogPostDetails {
  id: number;
  slug: string;
  title: string;
  title_ar: string;
  title_en: string;
  body?: string;
  body_ar?: string;
  body_en?: string;
  content?: string;
  content_ar?: string;
  content_en?: string;
  summary?: string;
  summary_ar?: string;
  summary_en?: string;
  image?: string;
  photo?: string;
  created_at: string;
  updated_at?: string;
  category?: BlogCategory;
  author?: {
    id: number;
    name: string;
  };
  comments?: Comment[];
  related_posts?: BlogPostListItem[];
  latest_posts?: BlogPostListItem[];
  categories?: BlogCategory[];
}

export interface CreateCommentRequest {
  body: string;
  author_name?: string;
  author_email?: string;
}

export interface ReplyToCommentRequest {
  body: string;
  author_name?: string;
  author_email?: string;
}
