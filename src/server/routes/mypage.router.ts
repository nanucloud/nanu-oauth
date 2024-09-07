import express from 'express'
import { FindUser } from '../controller/mypage.controller';

const router = express.Router();

router.post('/',FindUser)

export default router