import { db } from './app.mjs';
import type { CommentInternalRequest, CommentRequest, PostRequest, PostUID } from 'shared';
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

  public static async removePost(req: Request<{ post: PostUID }>, res: Response): Promise<Response> {
    try {
      const { post } = req.params;
      const result = await db.removePost(post);

      return res.status(200).json(result);
    } catch (err) {
      return httpError(err, res);
    }
  }
  
  public static async vote(req: Request<{post: PostUID}, unknown, unknown, {vote: string}>, res: Response): Promise<Response> {
    try {
      const { post } = req.params;
      const { vote } = req.query;
      let result = 0;
      
      switch (vote) {
        case "up":
          result = await db.upvotePost(post);
          break;

        case "down":
          result = await db.downvotePost(post);
          break;

        default:
          throw new DatabaseError('bad request', 400);
      }
      
      return res.status(200).json(result);
    } catch (err) {
      return httpError(err, res);
    }
  }
  
  public static async addComment(req: Request<{post: PostUID}, unknown, CommentRequest>, res: Response): Promise<Response> {
    try {
      const postUID = req.params.post;
      console.log(postUID);
      const commentReq = req.body
      const internalRequest: CommentInternalRequest = {
        commenterUID: commentReq.commenterUID,
        postUID: postUID,
        body: commentReq.body
      }
      
      const result = await db.addComment(internalRequest)
      return res.status(201).json(result)
    } catch (err) {
      return httpError(err, res);
    }
  }
}
