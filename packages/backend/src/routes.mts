import { Router } from 'express';

import { Controller } from './controller.mjs';

const router = Router();

router.get('', Controller.getPosts);
router.post('', Controller.addPost);
router.post('/:UID/vote', Controller.vote)
router.delete('/:UID', Controller.removePost);

export default router;
