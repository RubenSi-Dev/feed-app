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

export interface CommentRepository {
  addComment(req: CommentInternalRequest): Promise<CommentResponse>;
  getComments(UID: PostUID, page: number): Promise<CommentResponse[]>;
  upvotePost(UID: PostUID): Promise<number>;
  downvotePost(UID: PostUID): Promise<number>;
  getVotes(UID: PostUID): Promise<number>;
}

export interface UserRepository {
  createUser(req: UserRequest): Promise<UserResponse>;
  getUser(UID: UserUID): Promise<UserResponse>;
  getUsers(page: number): Promise<UserResponse[]>;
  getUserPosts(UID: UserUID, page: number): Promise<PostResponse[]>;
  getUserComments(UID: UserUID, page: number): Promise<CommentResponse[]>;
}

export interface PostRepository {
  getPost(UID: PostUID): Promise<PostResponse>;
  getPosts(page: number): Promise<PostResponse[]>;
  addPost(req: PostRequest): Promise<PostResponse>;
  removePost(UID: PostUID): Promise<PostResponse>;
}
