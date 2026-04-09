import { db } from '../app.mjs';
import type { PostRequest, PostUID } from 'shared';
import { httpError } from '../custom-types/DatabaseError.mjs';
import type { Request, Response } from 'express';

export abstract class PostController {
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

  public static async removePost(req: Request<{ post: PostUID }>, res: Response): Promise<Response> {
    try {
      const { post } = req.params;
      const result = await db.removePost(post);

      return res.status(200).json(result);
    } catch (err) {
      return httpError(err, res);
    }
  }
}
