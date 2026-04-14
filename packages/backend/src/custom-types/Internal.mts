import type { UserUID } from 'shared';

export type UserInternal = {
  UID: UserUID;
  username: string;
  passwordHashed: string;
};
