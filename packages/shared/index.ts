export type PostResponse = {
  UID: PostUID;
  publisher: string;
  contents: ContentsResponse;
  score: number;
  date: DateResponse;
  comments: CommentUID[];
};

export type ContentsResponse = {
  title: string;
  body: string;
};

export type DateResponse = {
  dayOfWeek: string;
  month: string;
  day: number;
  year: number;
  time: {
    hour: number;
    minute: number;
  };
};

export function toDateResponse(date: Date): DateResponse {
  const dateStrings = date.toString().split(' ');
  return {
    dayOfWeek: dateStrings[0],
    month: dateStrings[1],
    day: date.getDay(),
    year: date.getFullYear(),
    time: {
      hour: date.getHours(),
      minute: date.getMinutes(),
    },
  };
}

export type PostRequest = {
  publisherUID: UserUID;
  contents: ContentsResponse;
};

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
  date: DateResponse;
};

export type PostUID = string;
export type UserUID = string;
export type CommentUID = string;
