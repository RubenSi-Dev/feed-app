import type { PostResponse, PostUID } from 'shared';
import { BASE_URL } from '../main';

export const postService = {
  async getPosts(page?: number): Promise<PostResponse[]> {
    const url = new URL(`${BASE_URL}/feed`);
    if (page) url.searchParams.append('page', String(page));
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
  },

  async getPost(post: PostUID): Promise<PostResponse> {
    const url = new URL(`${BASE_URL}/posts/${post}`);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to get post');
    return response.json();
  },

  async voteOnPost(post: PostUID, vote: 'up' | 'down'): Promise<number> {
    const url = new URL(`${BASE_URL}/posts/${post}/votes`);
    url.searchParams.append('vote', vote);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('vote failed');
    return response.json();
  },
};
