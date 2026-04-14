import { Router } from 'express';

import { PostController } from './controllers/post-controller.mjs';
import { CommentController } from './controllers/comment-controller.mjs';
import { UserController } from './controllers/user-controller.mjs';
import { authenticate } from './middleware/auth.mjs';

const router = Router();

// Posts routes
router.get('/feed', PostController.getPosts);
router.get('/posts/:post', PostController.getPost);
router.post('/feed', authenticate, PostController.addPost);
router.delete('/posts/:post', authenticate, PostController.removePost);
router.get('/posts/:post/votes', PostController.getVotes);
router.post('/posts/:post/votes', authenticate, PostController.vote);

// Comment routes
router.get('/posts/:post/comments', CommentController.getComments);
router.post('/posts/:post/comments', authenticate, CommentController.addComment);
router.get('/posts/:post/comments/:comment/votes', CommentController.getVotes);
router.post('/posts/:post/comments/:comment/votes', authenticate, CommentController.vote);

// User routes
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/users/:user', UserController.getUser);
router.get('/users', UserController.getUsers);
router.get('/users/:user/posts', UserController.getUserPosts);
router.get('/users/:user/comments', UserController.getUserComments);

export default router;
