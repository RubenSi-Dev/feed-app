import express, { type Application } from 'express';
import { Database } from './mockDB.mjs';
import routes from './routes.mjs';

export const pageSize = 20;
export const db = new Database();
const app: Application = express();

app.use(express.json());
app.use('', routes);

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

export default app;
