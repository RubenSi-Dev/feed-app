import type { UserRequest, UserResponse, UserUID } from 'shared';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import { httpError } from '../custom-types/DatabaseError.mjs';
import { userRepo } from '../app.mjs';
import bcrypt from 'bcrypt';

const JWT_SECRET = 'test-secret';

export abstract class UserController {
  public static async getUsers(
    req: Request<unknown, unknown, unknown, { page: number }>,
    res: Response,
  ): Promise<Response> {
    try {
      let { page } = req.query;
      if (!page || isNaN(page)) {
        page = 0;
      }
      const result = await userRepo.getUsers(page);

      return res.status(200).json(result);
    } catch (err) {
      return httpError(err, res);
    }
  }

  public static async registerUser(
    req: Request<unknown, unknown, UserRequest, unknown>,
    res: Response,
  ): Promise<Response> {
    try {
      const userReq = req.body;
      const result = await userRepo.registerUser(userReq);

      return UserController.issueToken(res, result);
    } catch (err) {
      return httpError(err, res);
    }
  }

  public static async login(req: Request<unknown, unknown, UserRequest>, res: Response): Promise<Response> {
    try {
      const userReq = req.body;
      const user = await userRepo.getUserByUsername(userReq.username);

      if (!user || !(await bcrypt.compare(userReq.password, user.passwordHashed)))
        return res.status(401).json({ error: 'invalid credentials' });

      return UserController.issueToken(res, { UID: user.UID, username: user.username });
    } catch (err) {
      return httpError(err, res);
    }
  }

  public static async logout(res: Response): Promise<Response> {
    try {
      // clear cookie named token
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'strict',
        path: '/',
      });

      return res.status(200).json({ message: 'Successfully logged out' });
    } catch (err) {
      return httpError(err, res);
    }
  }

  private static async issueToken(res: Response, user: UserResponse): Promise<Response> {
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(user);
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

  public static async getUserPosts(
    req: Request<{ user: UserUID }, unknown, unknown, { page: number }>,
    res: Response,
  ): Promise<Response> {
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

  public static async getUserComments(
    req: Request<{ user: UserUID }, unknown, unknown, { page: number }>,
    res: Response,
  ): Promise<Response> {
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
