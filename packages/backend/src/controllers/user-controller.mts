import type { UserRequest, UserUID } from 'shared';
import type { Request, Response } from 'express';
import { httpError } from '../custom-types/DatabaseError.mjs';
import { userRepo } from '../app.mjs';

export abstract class UserController {

  public static async getUsers(req: Request<unknown, unknown, unknown, {page: number}>, res: Response): Promise<Response> {
    try {
      let { page } = req.query;
      if (!page || isNaN(page)) {
        page = 0;
      }
      const result = await userRepo.getUsers(page)
      
      return res.status(200).json(result)
    } catch (err) {
      return httpError(err, res);
    }
  }

  public static async createUser(
    req: Request<unknown, unknown, UserRequest, unknown>,
    res: Response,
  ): Promise<Response> {
    try {
      const userReq = req.body;
      const result = await userRepo.createUser(userReq);

      return res.status(201).json(result);
    } catch (err) {
      return httpError(err, res);
    }
  }

  public static async getUser(req: Request<{ user: UserUID }>, res: Response): Promise<Response> {
    try {
      const { user } = req.params;

      const result = await userRepo.getUser(user);

      return res.status(200).json(result);
    } catch (err) {
      return httpError(err, res);
    }
  }

  public static async getUserPosts(req: Request<{ user: UserUID }, unknown, unknown, {page: number}>, res: Response): Promise<Response> {
    try {
      let { page } = req.query;
      if (!page || isNaN(page)) {
        page = 0;
      }
      const { user } = req.params;

      const result = await userRepo.getUserPosts(user, page);

      return res.status(200).json(result);
    } catch (err) {
      return httpError(err, res);
    }
  }

  public static async getUserComments(req: Request<{ user: UserUID }, unknown, unknown, {page: number}>, res: Response): Promise<Response> {
    try {
      let { page } = req.query;
      if (!page || isNaN(page)) {
        page = 0;
      }
      const { user } = req.params;

      const result = await userRepo.getUserComments(user, page);

      return res.status(200).json(result);
    } catch (err) {
      return httpError(err, res);
    }
  }
}
