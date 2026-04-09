import { db } from './app.mjs';
import type { PostRequest } from 'shared';
import { DatabaseError, httpError } from './custom-types/DatabaseError.mjs';
import type { Request, Response } from 'express';

export abstract class Controller {

  public static async getPosts(
    req: Request<unknown, unknown, unknown, { page: number }>,
    res: Response,
  ): Promise<Response> {
    try {
      let { page } = req.query;
      if (!page || isNaN(page)) {
        page = 0;
      }
      const posts = await db.getPosts(page);
      return res.status(200).json(posts);
    } catch (err) {
      return httpError(err, res);
    }
  }

  public static async addPost(req: Request<unknown, unknown, PostRequest>, res: Response): Promise<Response> {
    try {
      const post = req.body;

      console.log(req.body);
      const result = await db.addPost(post);

      return res.status(201).json(result);
    } catch (err) {
      //console.error(err);
      return httpError(err, res);
    }
  }

  public static async removePost(req: Request<{ UID: string }>, res: Response): Promise<Response> {
    try {
      const { UID } = req.params;
      const result = await db.removePost(UID);

      return res.status(200).json(result);
    } catch (err) {
      return httpError(err, res);
    }
  }
  
  public static async vote(req: Request<{UID: string}, unknown, unknown, {vote: string}>, res: Response): Promise<Response> {
    try {
      const { UID } = req.params;
      const { vote } = req.query;
      let result = 0;
      
      switch (vote) {
        case "up":
          result = await db.upvotePost(UID);
          break;

        case "down":
          result = await db.downvotePost(UID);
          break;

        default:
          throw new DatabaseError('bad request', 400);
      }
      
      return res.status(200).json(result)
    } catch (err) {
      return httpError(err, res)
    }
  }
}
