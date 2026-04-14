import type { PostUID, UserUID } from 'shared';

export type UserInternal = {
  UID: UserUID;
  username: string;
  passwordHashed: string;
};

export type CommentInternalRequest = {
  commenterUID: UserUID;
  postUID: PostUID;
  body: string;
};
