import type { CommentResponse, CommentUID, PostUID } from 'shared';
import { BASE_URL } from '../main';

export const commentService = {
  async getCommentsByPost(post: PostUID, page?: number): Promise<CommentResponse[]> {
    const url = new URL(`${BASE_URL}/posts/${post}/comments`);
    if (page) url.searchParams.append('page', String(page));
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch comments');
    return response.json();
  },

  async voteOnComment(post: PostUID, comment: CommentUID, vote: 'up' | 'down'): Promise<number> {
    const url = new URL(`${BASE_URL}/posts/${post}/comments/${comment}/votes`);
    url.searchParams.append('vote', vote);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('vote failed');
    return response.json();
  },
};
