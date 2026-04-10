import { defineConfig } from 'drizzle-kit';
import 'dotenv/config'

export default defineConfig({
  schema: './src/db/schema.mts',
  out: './drizzle',
  dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL || 'postgres://localhost:5432/feed_app_db',
	},
});
