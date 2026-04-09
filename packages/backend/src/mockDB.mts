import { User } from './models/user.mjs';
import { Post } from "./models/post.mjs";
import { pageSize } from './app.mjs';
import { DatabaseError } from './custom-types/DatabaseError.mjs';
import type { PostRequest, PostResponse, DateResponse, PostUID, UserUID, CommentInternalRequest, CommentResponse, CommentUID } from 'shared';
import { Comment } from './models/comment.mjs';


export class Database {
  private posts: Post[] = [];
  private users: User[] = [new User({ UID: '1', username: 'spunkie' })];

  private async toPostResponse(post: Post): Promise<PostResponse> {
    const user = await this.getUser(post.publisherUID);
    const dateStrings = post.date.toString().split(' ');
    const dateResult: DateResponse = {
      dayOfWeek: dateStrings[0],
      month: dateStrings[1],
      day: post.date.getDay(),
      year: post.date.getFullYear(),
      time: {
        hour: post.date.getHours(),
        minute: post.date.getMinutes(),
      },
    };
    return {
      UID: post.UID,
      publisher: user.username,
      score: post.score,
      contents: post.contents,
      date: dateResult,
      comments: post.comments.map(c => c.UID)
    };
  }

  private async toPostInternal(req: PostRequest): Promise<Post> {
    return new Post(req, await this.generatePostUID());
  }
  
  private async toCommentInternal(req: CommentInternalRequest): Promise<Comment> {
    return new Comment(req, await this.generateCommentUID(req.postUID))
  }

  private async generatePostUID(): Promise<PostUID> {
    const postIDs = this.posts.map(p => Number(p.UID))
    if (postIDs.length === 0) {
      return '0';
    }
    return (Math.max(...postIDs) + 1).toString()
  }
  
  private async generateCommentUID(pUID: PostUID): Promise<CommentUID> {
    const postCommentsIDs = await this.getPost(pUID).then(p => p.comments.map(c => Number(c.UID)))
    if (postCommentsIDs.length === 0) {
      return '0';
    }
    return (Math.max(...postCommentsIDs) + 1).toString()
  }

  //private async generateUserUID(): Promise<number> {
  //  return this.users.reduce((prev, current) => (prev.UID > current.UID ? prev : current)).UID + 1;
  //}

  public async getUser(UID: UserUID): Promise<User> {
    await Promise.resolve();
    const user = this.users.find((u) => u.UID === UID);
    if (!user) {
      throw new DatabaseError('user not found', 404);
    }
    return user;
  }

  public async getPost(UID: PostUID): Promise<Post> {
    await Promise.resolve();
    const post = this.posts.find((p) => p.UID === UID);
    if (!post) {
      throw new DatabaseError('post not found', 404);
    }
    return post;
  }

  public async getPosts(page: number = 0): Promise<PostResponse[]> {
    return Promise.all(this.posts.slice(pageSize * page, pageSize * (page + 1)).map((p) => this.toPostResponse(p)));
  }

  public async addPost(req: PostRequest): Promise<PostResponse> {
    const post = await this.toPostInternal(req);
    const user = await this.getUser(post.publisherUID);
    this.posts.push(post);
    user.addPost(post.UID)
    return this.toPostResponse(post);
  }

  public async removePost(UID: PostUID): Promise<Post> {
    const post = await this.getPost(UID);
    const user = await this.getUser(post.publisherUID);
    const newPosts = this.posts.filter((p) => p.UID !== UID);
    this.posts = newPosts;
    user.removePost(UID)
    return post;
  }
  
  public async upvotePost(UID: PostUID): Promise<number> {
    return this.getPost(UID).then(p => p.increaseScore());
  }
  
  public async downvotePost(UID: PostUID): Promise<number> {
    return this.getPost(UID).then(p => p.decreaseScore());
  }
  
  public async addComment(req: CommentInternalRequest): Promise<CommentResponse> {
    const post = await this.getPost(req.postUID);
    const username = await this.getUser(req.commenterUID).then(u => u.username);
    const comment = await this.toCommentInternal(req)
    post.addComment(comment)
    
    return {
      UID: comment.UID,
      commenter: username,
      body: comment.body,
    }
  }
  
}
