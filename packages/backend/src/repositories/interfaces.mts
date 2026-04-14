import type {
  CommentResponse,
  CommentUID,
  PostRequest,
  PostResponse,
  PostUID,
  UserRequest,
  UserResponse,
  UserUID,
} from 'shared';
import type { CommentInternalRequest, UserInternal } from '../custom-types/Internal.mjs';

export interface CommentRepository {
  addComment(req: CommentInternalRequest, user: UserResponse): Promise<CommentResponse>;
  getComments(UID: PostUID, page: number): Promise<CommentResponse[]>;
  voteOnComment(postID: PostUID, commentID: CommentUID, user: UserResponse, value: string): Promise<number>
  getVotes(postID: PostUID, commentID: CommentUID): Promise<number>;
}

export interface UserRepository {
  registerUser(req: UserRequest): Promise<UserResponse>;
  getUser(UID: UserUID): Promise<UserResponse>;
  getUsers(page: number): Promise<UserResponse[]>;
  getUserPosts(UID: UserUID, page: number): Promise<PostResponse[]>;
  getUserComments(UID: UserUID, page: number): Promise<CommentResponse[]>;
  getUserByUsername(username: string): Promise<UserInternal>;
}

export interface PostRepository {
  getPost(UID: PostUID): Promise<PostResponse>;
  getPosts(page: number): Promise<PostResponse[]>;
  addPost(req: PostRequest, user: UserResponse): Promise<PostResponse>;
  removePost(UID: PostUID, user: UserResponse): Promise<PostResponse>;
  voteOnPost(postID: PostUID, user: UserResponse, value: string): Promise<number>
  getVotes(UID: PostUID): Promise<number>;
}
