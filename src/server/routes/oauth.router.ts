import express from 'express';
import { clientAuthValidation, OAuthLogin, OAuthRefresh } from '../controller/oauth.controller';

const router = express.Router();

router.post('/login', OAuthLogin);

router.post('/refresh', OAuthRefresh);

router.post('/client_auth/:ClientId', clientAuthValidation);

export default router;
