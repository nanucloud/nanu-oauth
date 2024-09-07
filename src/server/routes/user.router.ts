import express from 'express'
import { CreateUser, DeleteUser, FindAllUser, FindUser, UpdateUser } from '../controller/user.controller'

const router = express.Router();

router.get('/all/', FindAllUser)
router.get('/:user_email', FindUser)
router.post('/', CreateUser)
router.put('/', UpdateUser)
router.delete('/:user_email', DeleteUser)

export default router