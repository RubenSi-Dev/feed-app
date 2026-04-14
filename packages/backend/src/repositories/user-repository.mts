import type { CommentResponse, PostResponse, UserRequest, UserResponse, UserUID } from 'shared';
import type { UserRepository } from './interfaces.mjs';
import { db } from '../db/index.mjs';
import { comments, posts, users } from '../db/schema.mjs';
import { eq } from 'drizzle-orm';
import { DatabaseError } from '../custom-types/DatabaseError.mjs';
import { toDateResponse } from '../util.mjs';
import { pageSize } from '../app.mjs';
import bcrypt from 'bcrypt';
import type { UserInternal } from '../custom-types/Internal.mjs';

export class UserRepoDrizzle implements UserRepository {
  async registerUser(req: UserRequest): Promise<UserResponse> {
    // check whether user already exists or not
    await db
      .select()
      .from(users)
      .where(eq(users.username, req.username))
      .then((v) => {
        if (v.length !== 0) throw new DatabaseError('A user with this username already exists', 499);
      });

    // create hashed password
    const hashedPW = await bcrypt.hash(req.password, 10);

    // create db entry
    const [res] = await db
      .insert(users)
      .values({
        uid: crypto.randomUUID(),
        username: req.username,
        password: hashedPW,
      })
      .returning();

    // return resulting response
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
      .from(users)
      .limit(pageSize)
      .offset(pageSize * page);
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
      .leftJoin(users, eq(users.uid, posts.publisherUid))
      .limit(pageSize)
      .offset(page * pageSize);

    return res.map((p) => {
      if (!p.publisher) throw new DatabaseError('user doesnt exist', 404);
      return {
        UID: p.UID,
        publisher: p.publisher,
        title: p.title,
        body: p.body,
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
        score: comments.score,
        date: comments.date,
      })
      .from(comments)
      .where(eq(comments.commenterUid, UID))
      .leftJoin(users, eq(users.uid, comments.commenterUid))
      .limit(pageSize)
      .offset(pageSize * page);
    return res.map((c) => {
      if (!c.commenter) throw new DatabaseError('user not found', 404);
      const result: CommentResponse = {
        UID: c.UID,
        commenter: c.commenter,
        body: c.body,
        date: toDateResponse(c.date),
        score: c.score,
      };
      return result;
    });
  }

  public async getUserByUsername(username: string): Promise<UserInternal> {
    const [result] = await db
      .select({
        UID: users.uid,
        username: users.username,
        passwordHashed: users.password,
      })
      .from(users)
      .where(eq(users.username, username));

    if (!result) throw new DatabaseError('user not found', 404);

    return result;
  }
}
