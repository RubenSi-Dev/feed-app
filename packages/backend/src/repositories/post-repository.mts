import type { PostUID, PostResponse, PostRequest } from 'shared';
import type { PostRepository } from './interfaces.mjs';
import { pageSize } from '../app.mjs';
import { db } from '../db/index.mjs';
import { posts, users } from '../db/schema.mjs';
import { eq } from 'drizzle-orm';
import { toDateResponse } from '../util.mjs';
import { DatabaseError } from '../custom-types/DatabaseError.mjs';

export class PostRepoDrizzle implements PostRepository {
  async getPost(UID: PostUID): Promise<PostResponse> {
    const response = await db
      .select({
        uid: posts.uid,
        username: users.username,
        title: posts.title,
        body: posts.body,
        score: posts.score,
        date: posts.date,
        commentCount: posts.commentCount,
      })
      .from(posts)
      .where(eq(posts.uid, UID))
      .leftJoin(users, eq(posts.publisherUid, users.uid));
    if (response.length === 0) throw new DatabaseError('post not found', 404);
    if (response.length > 1) throw new DatabaseError('multiple posts with same uid', 500);
    const res = response[0];
    if (!res.username) throw new DatabaseError('user doesnt exist', 404);
    return {
      UID: res.uid,
      publisher: res.username,
      title: res.title,
      body: res.body,
      score: res.score,
      date: toDateResponse(res.date),
      commentCount: res.commentCount,
    };
  }

  async getPosts(page: number = 0): Promise<PostResponse[]> {
    const res = await db
      .select({
        uid: posts.uid,
        username: users.username,
        title: posts.title,
        body: posts.body,
        score: posts.score,
        date: posts.date,
        commentCount: posts.commentCount,
      })
      .from(posts)
      .leftJoin(users, eq(posts.publisherUid, users.uid))
      .limit(20)
      .offset(page * pageSize);

    return res.map((p) => {
      if (!p.username) throw new DatabaseError(`user not found`, 404);
      return {
        UID: p.uid,
        publisher: p.username,
        title: p.title,
        body: p.body,
        score: p.score,
        date: toDateResponse(p.date),
        commentCount: p.commentCount,
      };
    });
  }

  async addPost(req: PostRequest): Promise<PostResponse> {
    const [newPost] = await db
      .insert(posts)
      .values({
        uid: crypto.randomUUID(),
        publisherUid: req.publisherUID,
        title: req.title,
        body: req.body,
      })
      .returning();

    const [user] = await db.select({ username: users.username }).from(users).where(eq(users.uid, req.publisherUID));

    return {
      UID: newPost.uid,
      publisher: user.username,
      title: newPost.title,
      body: newPost.body,
      score: newPost.score,
      date: toDateResponse(newPost.date),
      commentCount: newPost.commentCount,
    };
  }

  async removePost(UID: PostUID): Promise<PostResponse> {
    const deletedRows = await db.delete(posts).where(eq(posts.uid, UID)).returning();

    if (deletedRows.length === 0) throw new DatabaseError('Post not found', 404);
    const res = deletedRows[0];

    const [user] = await db.select({ username: users.username }).from(users).where(eq(users.uid, res.publisherUid));

    return {
      UID: res.uid,
      publisher: user.username,
      title: res.title,
      body: res.body,
      score: res.score,
      date: toDateResponse(res.date),
      commentCount: res.commentCount,
    };
  }
}
