import type { CommentResponse, CommentUID, PostUID, UserResponse } from 'shared';
import type { CommentInternalRequest } from '../custom-types/Internal.mjs';
import type { CommentRepository } from './interfaces.mjs';
import { db } from '../db/index.mjs';
import { comments, posts, users } from '../db/schema.mjs';
import { eq, sql, and } from 'drizzle-orm';
import { toDateResponse } from '../util.mjs';
import { DatabaseError } from '../custom-types/DatabaseError.mjs';
import { pageSize } from '../app.mjs';

export class CommentRepoDrizzle implements CommentRepository {
  async addComment(req: CommentInternalRequest, user: UserResponse): Promise<CommentResponse> {
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
        commenterUid: user.UID,
        body: req.body,
        score: 0,
        commentCount: 0,
      })
      .returning();

    return {
      UID: newComment.uid,
      commenter: user.username,
      body: newComment.body,
      score: newComment.score,
      date: toDateResponse(newComment.date),
    };
  }

  async getComments(UID: PostUID, page: number): Promise<CommentResponse[]> {
    const res = await db
      .select({
        uid: comments.uid,
        commenter: users.username,
        body: comments.body,
        score: comments.score,
        date: comments.date,
      })
      .from(comments)
      .where(eq(comments.postUid, UID))
      .leftJoin(users, eq(users.uid, comments.commenterUid))
      .limit(pageSize)
      .offset(pageSize * page);

    return res.map((c) => {
      if (!c.commenter) throw new DatabaseError('invalid user', 500);
      return {
        UID: c.uid,
        commenter: c.commenter,
        body: c.body,
        score: c.score,
        date: toDateResponse(c.date),
      };
    });
  }

  async voteOnComment(
    postID: PostUID,
    commentID: CommentUID,
    user: UserResponse,
    value: string,
  ): Promise<number> {
    let op: string;
    switch (value) {
      case 'up': {
        op = '+';
        break;
      }
      case 'down': {
        op = '-';
        break;
      }
      default:
        throw new DatabaseError('bad request', 400);
    }
    const result = await db
      .update(comments)
      .set({ score: sql`${comments.score} ${op} 1` })
      .where(and(eq(comments.uid, commentID), eq(comments.postUid, postID)))
      .returning({ newScore: comments.score });
    if (result.length === 0) throw new DatabaseError('comment not found', 404);
    return result[0].newScore;
  }

  async getVotes(postID: PostUID, commentID: CommentUID): Promise<number> {
    const results = await db
      .select({ score: comments.score })
      .from(comments)
      .where(eq(comments.uid, commentID) && eq(comments.postUid, postID));
    if (results.length === 0) throw new DatabaseError('comment not found', 404);
    return results[0].score;
  }
}
