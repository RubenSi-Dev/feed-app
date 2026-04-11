import { UserUID, PostUID, CommentUID, DateResponse } from '.';

export type CommentInternalRequest = {
  commenterUID: UserUID;
  postUID: PostUID;
  body: string;
};

export type CommentRequest = {
  commenterUID: UserUID;
  body: string;
};

export type CommentResponse = {
  UID: CommentUID;
  commenter: string;
  body: string;
  score: number;
  date: DateResponse;
};
