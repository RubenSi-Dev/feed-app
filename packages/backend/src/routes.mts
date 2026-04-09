import { Router } from 'express';

import { Controller } from './controller.mjs';

const router = Router();

router.get('', Controller.getPosts);
router.post('', Controller.addPost);
router.post('/:post/vote', Controller.vote)
router.post('/:post/comment', Controller.addComment)
router.delete('/:post', Controller.removePost);

export default router;
