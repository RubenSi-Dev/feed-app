import { db } from '../app.mjs';
import type { CommentInternalRequest, CommentRequest, PostUID } from 'shared';
import { httpError } from '../custom-types/DatabaseError.mjs';
import type { Request, Response } from 'express';

export abstract class CommentController {
  public static async addComment(req: Request<{post: PostUID}, unknown, CommentRequest>, res: Response): Promise<Response> {
    try {
      const postUID = req.params.post;
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
  
  public static async getComments(req: Request<{post: PostUID}, unknown, unknown, {page: number}>, res: Response): Promise<Response> {
    try {
      const postUID = req.params.post;
      let { page } = req.query;
      if (!page || isNaN(page)) {
        page = 0;
      }
      const result = await db.getComments(postUID, page);
      
      return res.status(200).json(result)
    } catch (err) {
      return httpError(err, res)
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
}
