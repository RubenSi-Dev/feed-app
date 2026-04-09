import { User } from './models/user.mjs';
import { Post } from "./models/post.mjs";
import { pageSize } from './app.mjs';
import { DatabaseError } from './custom-types/DatabaseError.mjs';
import type { PostRequest, PostResponse, DateResponse, PostUID, UserUID } from 'shared';


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
      contents: post.contents,
      date: dateResult,
    };
  }

  private async toPostInternal(postRequest: PostRequest): Promise<Post> {
    await this.getUser(postRequest.publisherUID);
    return new Post(postRequest, await this.generatePostUID());
  }

  private async generatePostUID(): Promise<string> {
    if (this.posts.length === 0) {
      return '0';
    }
    return (
      Number(this.posts.reduce((prev, current) => (Number(prev.UID) > Number(current.UID) ? prev : current)).UID) + 1
    ).toString();
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
    this.posts.push(post);

    return this.toPostResponse(post);
  }

  public async removePost(UID: PostUID): Promise<Post> {
    const post = await this.getPost(UID);
    const newPosts = this.posts.filter((p) => p.UID !== UID);
    this.posts = newPosts;
    return post;
  }
  
  public async upvotePost(UID: PostUID): Promise<number> {
    return this.getPost(UID).then(p => p.increaseScore());
  }
  
  public async downvotePost(UID: PostUID): Promise<number> {
    return this.getPost(UID).then(p => p.decreaseScore());
  }
  
}
