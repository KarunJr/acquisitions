import express from 'express';
import { signin, signout, signup } from '#controllers/auth.controller.js';
import { cleanAsync } from '#utils/cleanAsync.js';

const router = express.Router();

router.post('/sign-up', cleanAsync(signup));

router.post('/sign-in', cleanAsync(signin));

router.post('/sign-out', signout);

export default router;
