import express from 'express'
import { createPermission, getPermission } from '../controller/permission.controller'

const router = express.Router();

router.post('/', createPermission)
router.get('/', getPermission)

export default router