import { postRepo } from '../app.mjs';
import type { PostRequest, PostUID } from 'shared';
import { DatabaseError, httpError } from '../custom-types/DatabaseError.mjs';
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
      const posts = await postRepo.getPosts(page);
      return res.status(200).json(posts);
    } catch (err) {
      return httpError(err, res);
    }
  }

	public static async getPost(req: Request<{post: PostUID}>, res: Response): Promise<Response> {
		try {
			const postUID = req.params.post;
			const result = await postRepo.getPost(postUID);

			return res.status(200).json(result);
		} catch (err) {
			return httpError(err, res);
		}
	}

  public static async addPost(req: Request<unknown, unknown, PostRequest>, res: Response): Promise<Response> {
    try {
      const post = req.body;

      console.log(req.body);
      const result = await postRepo.addPost(post);

      return res.status(201).json(result);
    } catch (err) {
      //console.error(err);
      return httpError(err, res);
    }
  }

  public static async removePost(req: Request<{ post: PostUID }>, res: Response): Promise<Response> {
    try {
      const { post } = req.params;
      const result = await postRepo.removePost(post);

      return res.status(200).json(result);
    } catch (err) {
      return httpError(err, res);
    }
  }

  public static async vote(
    req: Request<{ post: PostUID }, unknown, unknown, { vote: string }>,
    res: Response,
  ): Promise<Response> {
    try {
      const { post } = req.params;
      const { vote } = req.query;
      let result = 0;

      switch (vote) {
        case 'up':
          result = await postRepo.upvotePost(post);
          break;

        case 'down':
          result = await postRepo.downvotePost(post);
          break;

        default:
          throw new DatabaseError('bad request', 400);
      }

      return res.status(200).json(result);
    } catch (err) {
      return httpError(err, res);
    }
  }

  public static async getVotes(req: Request<{ post: PostUID }>, res: Response): Promise<Response> {
    try {
      const { post } = req.params;
      const votes = await postRepo.getVotes(post);
      return res.status(200).json(votes);
    } catch (err) {
      return httpError(err, res);
    }
  }
}
