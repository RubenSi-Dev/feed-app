import { Router } from 'express';

import { PostController } from './controllers/post-controller.mjs';
import { CommentController } from './controllers/comment-controller.mjs';
import { UserController } from './controllers/user-controller.mjs';

const router = Router();

// Posts routes
router.get('', PostController.getPosts);
router.post('', PostController.addPost);
router.delete('/:post', PostController.removePost);

// Comment routes
router.get('/:post/vote', CommentController.getVotes);
router.post('/:post/vote', CommentController.vote);

router.get('/:post/comments', CommentController.getComments);
router.post('/:post/comments', CommentController.addComment);

// User routes
router.post('/users', UserController.createUser);
router.get('/users/:user', UserController.getUser);
router.get('/users', UserController.getUsers);
router.get('/users/:user/posts', UserController.getUserPosts);
router.get('/users/:user/comments', UserController.getUserComments);

export default router;
