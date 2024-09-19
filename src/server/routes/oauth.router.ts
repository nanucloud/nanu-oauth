import express from 'express';
import { OAuthLogin, OAuthRefresh } from '../controller/oauth.controller';

const router = express.Router();

router.post('/login', OAuthLogin);

router.post('/refresh', OAuthRefresh);

router.post('/refresh', OAuthRefresh);

export default router;
