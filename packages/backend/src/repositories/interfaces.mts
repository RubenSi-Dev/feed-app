import type {
  CommentInternalRequest,
  CommentResponse,
  PostRequest,
  PostResponse,
  PostUID,
  UserRequest,
  UserResponse,
  UserUID,
} from 'shared';
import type { User } from '../models/user.mjs';

export interface CommentRepository {
  addComment(req: CommentInternalRequest): Promise<CommentResponse>;
  getComments(UID: PostUID, page: number): Promise<CommentResponse[]>;
  upvotePost(UID: PostUID): Promise<number>;
  downvotePost(UID: PostUID): Promise<number>;
  getVotes(UID: PostUID): Promise<number>;
}

export interface UserRepository {
  createUser(req: UserRequest): Promise<UserResponse>;
  getUser(UID: UserUID): Promise<User>;
  getUsers(page: number): Promise<User[]>;
}

export interface PostRepository {
  getPost(UID: PostUID): Promise<PostResponse>;
  getPosts(page: number): Promise<PostResponse[]>;
  addPost(req: PostRequest): Promise<PostResponse>;
  removePost(UID: PostUID): Promise<PostResponse>;
}
