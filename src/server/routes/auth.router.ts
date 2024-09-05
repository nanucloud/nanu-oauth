import express from 'express'
import { AuthController } from '../controller/auth.contoller'

const router = express.Router();
const authController = new AuthController();

router.get('/',authController.login)
router.post('/', authController.handleOAuthRequest)

export default router