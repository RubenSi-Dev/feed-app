import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.mjs';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL ? process.env.DATABASE_URL : 'fail';
console.log(connectionString);
const client = postgres(connectionString);
export const db = drizzle(client, { schema });
