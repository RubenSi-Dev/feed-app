import { Router } from 'express';

import { Controller } from './controller.mjs';

const router = Router();

router.get('', Controller.getPosts);
router.post('', Controller.addPost);
router.delete('/:post', Controller.removePost);
router.post('/:post/vote', Controller.vote)
router.get('/:post/comments', Controller.getComments)
router.post('/:post/comments', Controller.addComment)

export default router;
