import express from 'express'
import { createPermission } from '../controller/permission.controller'

const router = express.Router();

router.post('/', createPermission)

export default router