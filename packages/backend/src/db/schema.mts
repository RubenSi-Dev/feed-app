import { pgTable, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  uid: varchar('uid').primaryKey(),
  username: varchar('username', { length: 50 }).notNull(),
});

export const posts = pgTable('posts', {
  uid: varchar('uid').primaryKey(),
  publisherUid: varchar('publisher_uid')
    .notNull()
    .references(() => users.uid),
  title: varchar('title', { length: 255 }).notNull(),
  body: varchar('body').notNull(),
  score: integer('score').default(0).notNull(),
  commentCount: integer('comment_count').default(0).notNull(),
  date: timestamp('date').defaultNow().notNull(),
});

export const comments = pgTable('comments', {
  uid: varchar('uid').primaryKey(),
  postUid: varchar('post_uid')
    .references(() => posts.uid)
    .notNull(),
  commenterUid: varchar('commenter_uid')
    .notNull()
    .references(() => users.uid),
  body: varchar('body').notNull(),
  score: integer('score').default(0).notNull(),
  commentCount: integer('comment_count').default(0).notNull(),
  date: timestamp('date').defaultNow().notNull(),
});
