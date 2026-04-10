import express, { type Application } from 'express';
//import { mockDatabase } from './mockDB.mjs';
import routes from './routes.mjs';
import { CommentRepoDrizzle } from './repositories/comment-repository.mjs';
import { PostRepoDrizzle } from './repositories/post-repository.mjs';
import { UserRepoDrizzle } from './repositories/user-repository.mjs';

export const pageSize = 20;
//export const db = new mockDatabase();
export const commentRepo = new CommentRepoDrizzle();
export const postRepo = new PostRepoDrizzle();
export const userRepo = new UserRepoDrizzle();
const app: Application = express();

app.use(express.json());
app.use('', routes);

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

export default app;
