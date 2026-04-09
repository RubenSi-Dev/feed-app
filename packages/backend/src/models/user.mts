import type { CommentUID, PostUID, UserUID } from "shared";

export class User {
  private _UID: UserUID;

  public get UID(): UserUID {
    return this._UID;
  }

  private _username: string;

  public get username(): string {
    return this._username;
  }

  public set username(value: string) {
    this._username = value;
  }
  
  private _posts: PostUID[];
  public get posts(): PostUID[] {
    return this._posts;
  }
  
  public addPost(UID: PostUID): void {
    this._posts.push(UID)
  }
  
  public removePost(UID: PostUID): void {
    this._posts.filter(p => p !== UID);
  }
  
  constructor(req: { UID: UserUID; username: string }) {
    this._UID = req.UID;
    this._username = req.username;
    this._posts = []
  }
}
