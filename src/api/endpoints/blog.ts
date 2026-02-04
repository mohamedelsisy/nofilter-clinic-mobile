import apiClient from '../client';
import { ApiResponse } from '../types';
import { BlogPostListItem, BlogPostDetails } from '../types/blog';

/**
 * Get blog posts list (paginated)
 */
export const getBlogPosts = async (params?: {
  page?: number;
}): Promise<ApiResponse<BlogPostListItem[]>> => {
  const response = await apiClient.get<ApiResponse<BlogPostListItem[]>>('/site/blog', {
    params: {
      page: params?.page || 1,
    },
  });
  return response.data;
};

/**
 * Get single blog post by slug
 */
export const getBlogPost = async (slug: string): Promise<BlogPostDetails> => {
  const response = await apiClient.get<ApiResponse<BlogPostDetails>>(`/site/blog/${slug}`);
  return response.data.data;
};

/**
 * Search blog posts
 */
export const searchBlogPosts = async (params: {
  q: string;
  page?: number;
}): Promise<ApiResponse<BlogPostListItem[]>> => {
  const response = await apiClient.get<ApiResponse<BlogPostListItem[]>>('/site/blog/search', {
    params: {
      q: params.q,
      page: params.page || 1,
    },
  });
  return response.data;
};

/**
 * Get posts by category slug
 */
export const getPostsByCategory = async (params: {
  slug: string;
  page?: number;
}): Promise<ApiResponse<BlogPostListItem[]>> => {
  const response = await apiClient.get<ApiResponse<BlogPostListItem[]>>(
    `/site/blog/category/${params.slug}`,
    {
      params: {
        page: params.page || 1,
      },
    }
  );
  return response.data;
};

// React Query keys for blog
export const blogKeys = {
  all: ['blog'] as const,
  lists: () => [...blogKeys.all, 'list'] as const,
  list: (page: number) => [...blogKeys.lists(), page] as const,
  details: () => [...blogKeys.all, 'detail'] as const,
  detail: (slug: string) => [...blogKeys.details(), slug] as const,
  search: (q: string, page: number) => [...blogKeys.all, 'search', q, page] as const,
  category: (slug: string, page: number) => [...blogKeys.all, 'category', slug, page] as const,
};
