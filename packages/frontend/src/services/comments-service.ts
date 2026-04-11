import type { CommentResponse, PostUID } from 'shared';
import { BASE_URL } from '../main';

export const commentService = {
  async getCommentsByPost(post: PostUID, page?: number): Promise<CommentResponse[]> {
    const url = new URL(`${BASE_URL}/${post}/comments`);
    if (page) url.searchParams.append('page', String(page));
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch comments');
    return response.json();
  },
};
