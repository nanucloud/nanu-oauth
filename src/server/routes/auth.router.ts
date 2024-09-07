import express from 'express'
import {JoinUser, LoginUser} from '../controller/auth.controller'

const router = express.Router();

router.post('/login',LoginUser)
router.post('/join',JoinUser)

export default router