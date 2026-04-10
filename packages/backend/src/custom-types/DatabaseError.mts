import type { Response } from 'express';

export class DatabaseError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'DatabaseError';
  }
}

export function httpError(err: unknown, res: Response): Response {
  //console.error(err);
  if (err instanceof DatabaseError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
    });
  }
  console.log(err);
  return res.status(500).json({ error: 'internal error' });
}
