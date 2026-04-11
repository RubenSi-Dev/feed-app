export * from './posts';
export * from './comments';
export * from './users';

// common
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

export type PostUID = string;
export type UserUID = string;
export type CommentUID = string;
