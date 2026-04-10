import type { CommentInternalRequest, CommentUID, PostUID, UserUID } from 'shared';

export class Comment {
  private _UID: CommentUID;
  public get UID(): string {
    return this._UID;
  }

  private _commenterUID: UserUID;
  public get commenterUID(): UserUID {
    return this._commenterUID;
  }

  private _postUID: PostUID;
  public get postUID(): PostUID {
    return this._postUID;
  }

  private _body: string;
  public get body(): string {
    return this._body;
  }

  private _date: Date;
  public get date(): Date {
    return this._date;
  }

  constructor(req: CommentInternalRequest, commentUID: CommentUID) {
    this._UID = commentUID;
    this._commenterUID = req.commenterUID;
    this._postUID = req.postUID;
    this._body = req.body;
    this._date = new Date();
  }
}
