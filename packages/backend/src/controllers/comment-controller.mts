import { commentRepo } from '../app.mjs';
import type { CommentRequest, CommentUID, PostUID } from 'shared';
import type { CommentInternalRequest } from '../custom-types/Internal.mjs';
import { DatabaseError, httpError } from '../custom-types/DatabaseError.mjs';
import type { Request, Response } from 'express';

export abstract class CommentController {
  public static async addComment(
    req: Request<{ post: PostUID }, unknown, CommentRequest>,
    res: Response,
  ): Promise<Response> {
    try {
      const user = req.user!;
      const postUID = req.params.post;
      const commentReq = req.body;
      const internalRequest: CommentInternalRequest = {
        commenterUID: commentReq.commenterUID,
        postUID: postUID,
        body: commentReq.body,
      };

      const result = await commentRepo.addComment(internalRequest, user);
      return res.status(201).json(result);
    } catch (err) {
      return httpError(err, res);
    }
  }

  public static async getComments(
    req: Request<{ post: PostUID }, unknown, unknown, { page: number }>,
    res: Response,
  ): Promise<Response> {
    try {
      const postUID = req.params.post;
      let { page } = req.query;
      if (!page || isNaN(page)) {
        page = 0;
      }
      const result = await commentRepo.getComments(postUID, page);

      return res.status(200).json(result);
    } catch (err) {
      return httpError(err, res);
    }
  }

  public static async vote(
    req: Request<{ post: PostUID; comment: CommentUID }, unknown, unknown, { vote: string }>,
    res: Response,
  ): Promise<Response> {
    try {
      const { post, comment } = req.params;
      const { vote } = req.query;
      let result = 0;

      switch (vote) {
        case 'up':
          result = await commentRepo.upvoteComment(post, comment);
          break;

        case 'down':
          result = await commentRepo.downvoteComment(post, comment);
          break;

        default:
          throw new DatabaseError('bad request', 400);
      }

      return res.status(200).json(result);
    } catch (err) {
      return httpError(err, res);
    }
  }

  public static async getVotes(req: Request<{ post: PostUID; comment: CommentUID }>, res: Response): Promise<Response> {
    try {
      const { post, comment } = req.params;
      const votes = await commentRepo.getVotes(post, comment);
      return res.status(200).json(votes);
    } catch (err) {
      return httpError(err, res);
    }
  }
}
