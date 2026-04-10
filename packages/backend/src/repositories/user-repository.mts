import type { CommentResponse, PostResponse, UserRequest, UserResponse, UserUID } from 'shared';
import type { User } from '../models/user.mjs';
import type { UserRepository } from './interfaces.mjs';
import { db } from '../db/index.mjs';
import { users } from '../db/schema.mjs';

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

  getUser(UID: UserUID): Promise<User> {
    throw new Error('Method not implemented.');
  }

  getUsers(page: number): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  getUserPosts(UID: UserUID): Promise<PostResponse[]> {
    throw new Error('Method not implemented.');
  }
  getUserComments(UID: UserUID): Promise<CommentResponse[]> {
    throw new Error('Method not implemented.');
  }
}
