import type { CommentResponse, PostResponse, UserRequest, UserResponse, UserUID } from 'shared';
import type { UserRepository } from './interfaces.mjs';
import { db } from '../db/index.mjs';
import { comments, posts, users } from '../db/schema.mjs';
import { eq } from 'drizzle-orm';
import { DatabaseError } from '../custom-types/DatabaseError.mjs';
import { toDateResponse } from '../util.mjs';
import { pageSize } from '../app.mjs';

export class UserRepoDrizzle implements UserRepository {
  async createUser(req: UserRequest): Promise<UserResponse> {
    const [res] = await db
      .insert(users)
      .values({
        uid: crypto.randomUUID(),
        username: req.username,
      })
      .returning();

    return {
      UID: res.uid,
      username: res.username,
    };
  }

  async getUser(UID: UserUID): Promise<UserResponse> {
    const [user] = await db
      .select({
        UID: users.uid,
        username: users.username,
      })
      .from(users)
      .where(eq(users.uid, UID));
    if (!user) throw new DatabaseError('user not found', 404);
    return user;
  }

  async getUsers(page: number): Promise<UserResponse[]> {
    return db
      .select({
        UID: users.uid,
        username: users.username,
      })
      .from(users);
  }

  async getUserPosts(UID: UserUID, page: number): Promise<PostResponse[]> {
    const res = await db
      .select({
        UID: posts.uid,
        publisher: users.username,
        title: posts.title,
        body: posts.body,
        score: posts.score,
        date: posts.date,
        commentCount: posts.commentCount,
      })
      .from(posts)
      .where(eq(posts.publisherUid, UID))
      .leftJoin(users, eq(users.uid, posts.publisherUid)).limit(pageSize).offset(page*pageSize);

    return res.map((p) => {
      if (!p.publisher) throw new DatabaseError('user doesnt exist', 404);
      return {
        UID: p.UID,
        publisher: p.publisher,
        contents: {
          title: p.title,
          body: p.body,
        },
        score: p.score,
        date: toDateResponse(p.date),
        commentCount: p.commentCount,
      };
    });
  }

  async getUserComments(UID: UserUID, page: number): Promise<CommentResponse[]> {
    const res = await db
      .select({
        UID: comments.uid,
        commenter: users.username,
        body: comments.body,
        date: comments.date,
      })
      .from(comments)
      .where(eq(comments.commenterUid, UID))
      .leftJoin(users, eq(users.uid, comments.commenterUid)).limit(pageSize).offset(pageSize*page);
    return res.map((c) => {
      if (!c.commenter) throw new DatabaseError('user not found', 404);
      const result: CommentResponse = {
        UID: c.UID,
        commenter: c.commenter,
        body: c.body,
        date: toDateResponse(c.date),
      };
      return result;
    });
  }
}
