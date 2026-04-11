import { UserUID } from '.';

export type UserRequest = {
  username: string;
};

export type UserResponse = {
  UID: UserUID;
  username: string;
};
