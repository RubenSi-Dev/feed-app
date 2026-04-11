import type { DateResponse, PostUID, UserUID } from './index';

export type PostResponse = {
  UID: PostUID;
  publisher: string;
  title: string;
  body: string;
  score: number;
  date: DateResponse;
  commentCount: number;
};

export type PostRequest = {
  publisherUID: UserUID;
  title: string;
  body: string;
};
