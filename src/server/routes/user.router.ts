import express from 'express'
import {UserController} from '../controller/user.controller'

const router = express.Router();
const userController = new UserController();

router.get('/',userController.getUser)
router.post('/',userController.createUser)

export default router