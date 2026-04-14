import express, { type Application } from 'express';
//import { mockDatabase } from './mockDB.mjs';
import routes from './routes.mjs';
import { CommentRepoDrizzle } from './repositories/comment-repository.mjs';
import { PostRepoDrizzle } from './repositories/post-repository.mjs';
import { UserRepoDrizzle } from './repositories/user-repository.mjs';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';

export const pageSize = 10;
//export const db = new mockDatabase();
export const commentRepo = new CommentRepoDrizzle();
export const postRepo = new PostRepoDrizzle();
export const userRepo = new UserRepoDrizzle();
const app: Application = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
);

app.use(express.json());
app.use('', routes);

const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

export default app;
