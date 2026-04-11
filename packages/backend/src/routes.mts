import { Router } from 'express';

import { PostController } from './controllers/post-controller.mjs';
import { CommentController } from './controllers/comment-controller.mjs';
import { UserController } from './controllers/user-controller.mjs';

const router = Router();

// Posts routes
router.get('', PostController.getPosts);
router.get(':post', PostController.getPost);
router.post('', PostController.addPost);
router.delete('/:post', PostController.removePost);
router.get('/:post/vote', PostController.getVotes);
router.post('/:post/vote', PostController.vote);

// Comment routes
router.get('/:post/comments', CommentController.getComments);
router.post('/:post/comments', CommentController.addComment);
router.get('/:post/comments/:comment', PostController.getVotes);
router.post('/:post/comments/:comment', PostController.vote);

// User routes
router.post('/users', UserController.createUser);
router.get('/users/:user', UserController.getUser);
router.get('/users', UserController.getUsers);
router.get('/users/:user/posts', UserController.getUserPosts);
router.get('/users/:user/comments', UserController.getUserComments);

export default router;
