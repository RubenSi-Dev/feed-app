import type { CommentUID, PostRequest, PostUID, UserUID } from 'shared';
import type { Comment } from './comment.mjs';

export class Post {
  private _UID: PostUID;

  public get UID(): PostUID {
    return this._UID;
  }

  private _score: number;

  public get score(): number {
    return this._score;
  }

  public increaseScore(): number {
    this._score++;
    return this.score;
  }

  public decreaseScore(): number {
    this._score--;
    return this.score;
  }

  private _contents: { title: string; body: string };

  public get contents(): { title: string; body: string } {
    return this._contents;
  }

  public set contents(newContents: { title: string; body: string }) {
    this._date = new Date();
    this._contents = newContents;
  }

  private _publisherUID: UserUID;

  public get publisherUID(): UserUID {
    return this._publisherUID;
  }

  private _comments: Comment[];
  public get comments(): Comment[] {
    return this._comments;
  }

  public addComment(comment: Comment): void {
    this._comments.push(comment);
  }

  public removeCommentUID(commentUID: CommentUID): void {
    this._comments.filter((u) => u.UID !== commentUID);
  }

  private _date: Date;

  public get date(): Date {
    return this._date;
  }

  constructor(req: PostRequest, postUID: PostUID) {
    this._UID = postUID;
    this._contents = req.contents;
    this._publisherUID = req.publisherUID;
    this._comments = [];
    this._date = new Date();
    this._score = 0;
  }
}
