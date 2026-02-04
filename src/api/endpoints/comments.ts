import apiClient from '../client';
import { ApiResponse } from '../types';
import { Comment, CreateCommentRequest, ReplyToCommentRequest } from '../types/blog';

/**
 * Create a comment on a blog post
 * If authenticated: only body is required
 * If guest: author_name, author_email, and body are required
 */
export const createComment = async (
  postId: number,
  data: CreateCommentRequest
): Promise<Comment> => {
  const response = await apiClient.post<ApiResponse<Comment>>(
    `/site/blog/${postId}/comments`,
    data
  );
  return response.data.data;
};

/**
 * Reply to an existing comment
 * Same auth/guest logic as createComment
 */
export const replyToComment = async (
  commentId: number,
  data: ReplyToCommentRequest
): Promise<Comment> => {
  const response = await apiClient.post<ApiResponse<Comment>>(
    `/site/comments/${commentId}/reply`,
    data
  );
  return response.data.data;
};
