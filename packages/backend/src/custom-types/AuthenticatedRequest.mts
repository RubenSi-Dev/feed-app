import type { UserUID } from 'shared';

declare global {
  namespace Express {
    interface Request {
      user?: {
        UID: UserUID;
        username: string;
      };
    }
  }
}
