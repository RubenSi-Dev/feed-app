import type { PostResponse, PostUID } from "shared";

const BASE_URL = 'http://localhost:3000';

export const postService = {
  async getPosts(page?: number): Promise<PostResponse[]> {
		const url = new URL(`${BASE_URL}`)
		if (page) url.searchParams.append('page', String(page))
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json()
  },
  
  async voteOnPost(post: PostUID, vote: 'up' | 'down'): Promise<number> {
    const url = new URL(`${BASE_URL}/${post}/vote`);
    url.searchParams.append('vote', vote)
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
    });
    if (!response.ok) throw new Error('vote failed')
    return response.json();
  }
	//async getComments(): P
}
