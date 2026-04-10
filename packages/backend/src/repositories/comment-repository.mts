import type { CommentInternalRequest, CommentResponse, PostUID } from 'shared';
import type { CommentRepository } from './interfaces.mjs';
import { db } from '../db/index.mjs';
import { comments, posts, users } from '../db/schema.mjs';
import { eq, sql } from 'drizzle-orm';
import { toDateResponse } from '../util.mjs';
import { DatabaseError } from '../custom-types/DatabaseError.mjs';
import { pageSize } from '../app.mjs';

export class CommentRepoDrizzle implements CommentRepository {
  async addComment(req: CommentInternalRequest): Promise<CommentResponse> {
    const foundPosts = await db
      .update(posts)
      .set({ commentCount: sql`${posts.commentCount} + 1` })
      .where(eq(posts.uid, req.postUID))
      .returning({ newScore: posts.score });
    if (foundPosts.length === 0) throw new DatabaseError('post not found', 404);
    const [newComment] = await db
      .insert(comments)
      .values({
        uid: crypto.randomUUID(),
        postUid: req.postUID,
        commenterUid: req.commenterUID,
        body: req.body,
      })
      .returning();

    const [user] = await db
      .select({ username: users.username })
      .from(users)
      .where(eq(users.uid, newComment.commenterUid));

    return {
      UID: newComment.uid,
      commenter: user.username,
      body: newComment.body,
      date: toDateResponse(newComment.date),
    };
  }

  async getComments(UID: PostUID, page: number): Promise<CommentResponse[]> {
    const res = await db
      .select({
        uid: comments.uid,
        commenter: users.username,
        body: comments.body,
        date: comments.date,
      })
      .from(comments)
      .where(eq(comments.postUid, UID))
      .leftJoin(users, eq(users.uid, comments.commenterUid)).limit(pageSize).offset(pageSize*page)

    return res.map((c) => {
      if (!c.commenter) throw new DatabaseError('invalid user', 500);
      return {
        UID: c.uid,
        commenter: c.commenter,
        body: c.body,
        date: toDateResponse(c.date),
      };
    });
  }

  async upvotePost(UID: PostUID): Promise<number> {
    const result = await db
      .update(posts)
      .set({ score: sql`${posts.score} + 1` })
      .where(eq(posts.uid, UID))
      .returning({ newScore: posts.score });
    if (result.length === 0) throw new DatabaseError('post not found', 404);
    return result[0].newScore;
  }

  async downvotePost(UID: PostUID): Promise<number> {
    const result = await db
      .update(posts)
      .set({ score: sql`${posts.score} - 1` })
      .where(eq(posts.uid, UID))
      .returning({ newScore: posts.score });
    if (result.length === 0) throw new DatabaseError('post not found', 404);
    return result[0].newScore;
  }

  async getVotes(UID: PostUID): Promise<number> {
    const [score] = await db.select({ score: posts.score }).from(posts).where(eq(posts.uid, UID));
    return score.score;
  }
}
