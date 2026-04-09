import { Router } from 'express';

import { PostController } from './controllers/post-controller.mjs';
import { CommentController } from './controllers/comment-controller.mjs';

const router = Router();

// Posts routes
router.get('', PostController.getPosts);
router.post('', PostController.addPost);
router.delete('/:post', PostController.removePost);


// Comment routes
router.post('/:post/vote', CommentController.vote)
router.get('/:post/comments', CommentController.getComments)
router.post('/:post/comments', CommentController.addComment)

export default router;
