import express from 'express'
import { PermissionController } from '../controller/permission.controller'

const router = express.Router();
const permissionController = new PermissionController();

router.get('/', permissionController.createPermission)
router.post('/', permissionController.createPermission)

export default router