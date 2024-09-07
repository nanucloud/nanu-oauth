import express from 'express';
import { OAuthRedirect, OAuthLogin, OAuthRefresh } from '../controller/oauth.controller';

const router = express.Router();

router.post('/redirect', OAuthRedirect);

router.post('/login', OAuthLogin);

router.post('/refresh', OAuthRefresh);

export default router;
