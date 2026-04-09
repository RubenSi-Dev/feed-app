import type { UserUID } from "shared";

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

  constructor(req: { UID: UserUID; username: string }) {
    this._UID = req.UID;
    this._username = req.username;
  }
}
